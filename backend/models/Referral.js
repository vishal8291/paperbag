const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referrerCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    refereeEmail: { type: String, lowercase: true, trim: true },
    refereeId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // reward coupon sent to referrer after referee places first order
    rewardCoupon: { type: String },
    status:       { type: String, enum: ["pending", "signed_up", "ordered", "rewarded"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
