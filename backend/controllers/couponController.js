const Coupon = require("../models/Coupon");

// ── Validate a coupon code ─────────────────────────────────
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });

    if (!coupon.isActive)
      return res.status(400).json({ message: "This coupon is no longer active" });

    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ message: "This coupon has expired" });

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ message: "This coupon has reached its usage limit" });

    if (orderTotal !== undefined && orderTotal < coupon.minOrderAmount)
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
      });

    // Calculate discount
    let discountAmount;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((orderTotal * coupon.discountValue) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, orderTotal);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalTotal: Math.max(0, orderTotal - discountAmount),
      message: `Coupon applied! You save ₹${discountAmount.toFixed(2)}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── Get all coupons (admin) ────────────────────────────────
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── Create coupon (admin) ──────────────────────────────────
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;
    if (!code || !discountValue)
      return res.status(400).json({ message: "code and discountValue are required" });

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing)
      return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType:    discountType    || "percentage",
      discountValue:   Number(discountValue),
      minOrderAmount:  Number(minOrderAmount)  || 0,
      maxUses:         maxUses ? Number(maxUses) : null,
      expiresAt:       expiresAt ? new Date(expiresAt) : null,
      createdBy:       req.user._id,
    });

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Coupon code already exists" });
    res.status(500).json({ message: "Server error" });
  }
};

// ── Toggle coupon active/inactive (admin) ──────────────────
exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`, coupon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── Delete coupon (admin) ──────────────────────────────────
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
