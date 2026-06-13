const mongoose = require("mongoose");
const Order   = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require("../utils/sendEmail");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /api/orders (COD checkout) ───────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, total, couponCode, discountAmount, idempotencyKey } = req.body;

    // ── Basic presence checks ──────────────────────────────────
    if (!customer || !items?.length || total == null) {
      return res.status(400).json({ message: "Missing required order fields." });
    }
    if (!customer.name?.trim() || !customer.email || !customer.address?.trim()
        || !customer.city?.trim() || !customer.zipCode?.trim()) {
      return res.status(400).json({ message: "All customer fields are required." });
    }
    if (!EMAIL_REGEX.test(customer.email)) {
      return res.status(400).json({ message: "Invalid customer email." });
    }

    // ── Idempotency check ─────────────────────────────────────
    if (idempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey, storeId: req.storeId });
      if (existing) {
        return res.status(200).json({ message: "Order already placed.", order: existing });
      }
    }

    // ── Server-side price validation ──────────────────────────
    // Re-fetch prices from DB so client can never manipulate totals
    let calculatedSubtotal = 0;
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
      }
      const product = await Product.findOne({ _id: item.productId, storeId: req.storeId });
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedSubtotal += product.price * qty;
    }

    const safeDiscount = Math.max(0, Number(discountAmount) || 0);
    const expectedTotal = Math.max(0, calculatedSubtotal - safeDiscount);

    // Allow ±₹1 tolerance for floating-point rounding
    if (Math.abs(expectedTotal - Number(total)) > 1) {
      return res.status(400).json({
        message: "Order total does not match. Please refresh and try again.",
      });
    }

    // ── Sanitize customer data ────────────────────────────────
    const safeCustomer = {
      name:    String(customer.name).replace(/[<>"']/g, "").trim().slice(0, 100),
      email:   customer.email.toLowerCase().trim(),
      address: String(customer.address).replace(/[<>"']/g, "").trim().slice(0, 200),
      city:    String(customer.city).replace(/[<>"']/g, "").trim().slice(0, 60),
      zipCode: String(customer.zipCode).replace(/\D/g, "").slice(0, 10),
    };

    const order = await Order.create({
      storeId:        req.storeId,
      userId:         req.user?.id,
      customer:       safeCustomer,
      items:          items.map((i) => ({
        productId: i.productId,
        name:      String(i.name).slice(0, 200),
        price:     Number(i.price),
        quantity:  Math.max(1, parseInt(i.quantity, 10) || 1),
        imageUrl:  i.imageUrl,
      })),
      total:          expectedTotal,  // use server-calculated total
      paymentMethod:  "cod",
      paymentStatus:  "unpaid",
      couponCode:     couponCode ? String(couponCode).trim().toUpperCase().slice(0, 30) : undefined,
      discountAmount: safeDiscount,
      idempotencyKey: idempotencyKey || undefined,
    });

    // ── Decrement stock for each ordered item ─────────────────
    await Promise.all(
      items.map((i) =>
        Product.findOneAndUpdate({ _id: i.productId, storeId: req.storeId }, {
          $inc: { stock: -(Math.max(1, parseInt(i.quantity, 10) || 1)) },
        })
      )
    ).catch(() => {}); // non-blocking — don't fail the order if stock update errors

    sendOrderConfirmationEmail(safeCustomer.email, order).catch(() => {});

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order." });
  }
};

// ── GET /api/orders (seller/admin all orders) ─────────────────
exports.getAllOrders = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "seller") {
      filter.storeId = req.user.storeId;
    } else if (req.user.role === "admin" && req.storeId) {
      filter.storeId = req.storeId;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders." });
  }
};

// ── GET /api/orders/my (logged-in user's orders) ─────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, storeId: req.storeId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching your orders." });
  }
};

// ── GET /api/orders/:id ───────────────────────────────────────
exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // ── Ownership check — users can see their own orders, sellers see their store orders
    const isBuyer = order.userId && order.userId.toString() === req.user?.id;
    const isSeller = req.user?.role === "seller" && req.user?.storeId?.toString() === order.storeId?.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Error fetching order." });
  }
};

// ── PUT /api/orders/:id/status (seller/admin update status) ────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "out for delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Verify seller/admin owns this order's store
    if (req.user?.role !== "admin" && req.user?.storeId?.toString() !== order.storeId?.toString()) {
      return res.status(403).json({ message: "Access denied. You can only manage orders for your own store." });
    }

    order.status = status;
    await order.save();

    sendOrderStatusEmail(order.customer.email, order).catch(() => {});
    res.json({ message: "Order status updated.", order });
  } catch {
    res.status(500).json({ message: "Error updating order." });
  }
};
