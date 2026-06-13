const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for guest orders
    customer: {
      name:    { type: String, required: true },
      email:   { type: String, required: true },
      address: { type: String, required: true },
      city:    { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name:      { type: String, required: true },
        price:     { type: Number, required: true },
        quantity:  { type: Number, required: true },
        imageUrl:  { type: String },
      },
    ],
    total:        { type: Number, required: true },
    status:       { type: String, enum: ["pending", "processing", "shipped", "out for delivery", "delivered", "cancelled"], default: "pending" },
    // Payment
    paymentStatus:  { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    paymentMethod:  { type: String, enum: ["razorpay", "cod"], default: "cod" },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    // Coupon
    couponCode:     { type: String },
    discountAmount: { type: Number, default: 0 },
    // Idempotency — frontend sends a UUID to prevent duplicate submissions
    idempotencyKey: { type: String, sparse: true },
  },
  { timestamps: true }
);

// Unique index on idempotencyKey (sparse = nulls are allowed, only unique among non-null values)
orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Order", orderSchema);
