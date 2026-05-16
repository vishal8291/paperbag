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
      const existing = await Order.findOne({ idempotencyKey });
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
      const product = await Product.findById(item.productId);
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
        Product.findByIdAndUpdate(i.productId, {
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

// ── GET /api/orders (admin only) ─────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders." });
  }
};

// ── GET /api/orders/my (logged-in user's orders) ─────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
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

    // ── Ownership check — users can only see their own orders ──
    const isAdmin = req.user?.role === "admin";
    const isOwner = order.userId && order.userId.toString() === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Error fetching order." });
  }
};

// ── PUT /api/orders/:id/status (admin only) ───────────────────
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

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });

    sendOrderStatusEmail(order.customer.email, order).catch(() => {});
    res.json({ message: "Order status updated.", order });
  } catch {
    res.status(500).json({ message: "Error updating order." });
  }
};
