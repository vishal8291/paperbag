const Razorpay  = require("razorpay");
const crypto    = require("crypto");
const Order     = require("../models/Order");
const Product   = require("../models/Product");
const { sendOrderConfirmationEmail } = require("../utils/sendEmail");

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    : null;

// ── POST /api/payment/create-order ────────────────────────────
exports.createRazorpayOrder = async (req, res) => {
  if (!razorpay) return res.status(503).json({ message: "Payment gateway not configured." });

  try {
    const { total } = req.body; // total in ₹ (e.g. 299)
    if (!total || total <= 0) return res.status(400).json({ message: "Invalid order amount." });

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100), // paise
      currency: "INR",
      receipt:  "rcpt_" + Date.now(),
    });

    res.json({
      keyId:    process.env.RAZORPAY_KEY_ID,
      orderId:  razorpayOrder.id,
      amount:   razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment order." });
  }
};

// ── POST /api/payment/verify ───────────────────────────────────
exports.verifyPayment = async (req, res) => {
  if (!razorpay) return res.status(503).json({ message: "Payment gateway not configured." });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // { customer, items, total, couponCode, discountAmount }
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields." });
    }

    // HMAC signature verification
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed — invalid signature." });
    }

    // ── Decrement stock for each item ─────────────────────────
    if (orderData?.items?.length) {
      await Promise.all(
        orderData.items.map((i) =>
          Product.findByIdAndUpdate(i.productId, {
            $inc: { stock: -(Math.max(1, parseInt(i.quantity, 10) || 1)) },
          })
        )
      ).catch(() => {});
    }

    // Create order in DB after successful payment
    const order = await Order.create({
      userId:            req.user?.id,
      customer:          orderData.customer,
      items:             orderData.items,
      total:             orderData.total,
      status:            "processing",
      paymentStatus:     "paid",
      paymentMethod:     "razorpay",
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      couponCode:        orderData.couponCode,
      discountAmount:    orderData.discountAmount || 0,
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail(order.customer.email, order).catch(() => {});

    res.json({ success: true, message: "Payment verified. Order confirmed!", order });
  } catch (error) {
    res.status(500).json({ message: "Payment verification failed." });
  }
};
