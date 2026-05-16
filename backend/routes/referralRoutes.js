const express  = require("express");
const crypto   = require("crypto");
const Referral = require("../models/Referral");
const Coupon   = require("../models/Coupon");
const User     = require("../models/User");
const { protect } = require("../middleware/auth");
const { sendOrderStatusEmail } = require("../utils/sendEmail");

const router = express.Router();

// Generate a short unique referral code from userId
function makeCode(userId) {
  return "REF" + crypto
    .createHash("sha256")
    .update(String(userId))
    .digest("hex")
    .slice(0, 6)
    .toUpperCase();
}

// ── GET /api/referral/my ─── get or create referral code for logged-in user ──
router.get("/my", protect, async (req, res) => {
  try {
    const code = makeCode(req.user.id);
    let ref = await Referral.findOne({ referrerId: req.user.id, refereeId: null });

    if (!ref) {
      ref = await Referral.create({
        referrerId:   req.user.id,
        referrerCode: code,
        status:       "pending",
      });
    }

    res.json({
      code:  ref.referrerCode,
      link:  `${process.env.CLIENT_URL || "http://localhost:3000"}/register?ref=${ref.referrerCode}`,
      stats: await Referral.countDocuments({ referrerId: req.user.id, status: { $in: ["ordered", "rewarded"] } }),
    });
  } catch {
    res.status(500).json({ message: "Failed to get referral info." });
  }
});

// ── POST /api/referral/apply ─── called after a referee's first order ──
// Body: { referralCode }
router.post("/apply", protect, async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) return res.status(400).json({ message: "Referral code required." });

    const ref = await Referral.findOne({ referrerCode: referralCode.toUpperCase() });
    if (!ref) return res.status(404).json({ message: "Referral code not found." });
    if (ref.referrerId.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot use your own referral code." });
    }
    if (ref.status === "ordered" || ref.status === "rewarded") {
      return res.status(409).json({ message: "This referral has already been used." });
    }

    // Mark referee
    ref.refereeId    = req.user.id;
    ref.refereeEmail = req.user.email;
    ref.status       = "ordered";

    // Create ₹50 coupon for the referrer
    const couponCode = "REFERRAL" + crypto.randomBytes(3).toString("hex").toUpperCase();
    await Coupon.create({
      code:           couponCode,
      discountType:   "fixed",
      discountValue:  50,
      minOrderValue:  200,
      maxUses:        1,
      expiresAt:      new Date(Date.now() + 90 * 24 * 3600 * 1000), // 90 days
      isActive:       true,
    });

    ref.rewardCoupon = couponCode;
    ref.status       = "rewarded";
    await ref.save();

    // Notify referrer by email
    const referrer = await User.findById(ref.referrerId);
    if (referrer) {
      // Reuse status email as a simple notification (no order object needed)
      // Build a minimal email via transporter directly in next iteration
    }

    res.json({ message: "Referral applied! Referrer gets ₹50 off coupon.", couponCode });
  } catch {
    res.status(500).json({ message: "Failed to apply referral." });
  }
});

module.exports = router;
