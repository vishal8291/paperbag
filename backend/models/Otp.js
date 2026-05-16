const mongoose = require("mongoose");

// OTP documents auto-expire after 10 minutes (TTL index on createdAt)
const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, lowercase: true },  // email
  otpHash:    { type: String, required: true },                   // bcrypt hash of 6-digit code
  type:       { type: String, enum: ["auth", "reset"], required: true },
  name:       { type: String, default: "" },                      // for new user registration
  attempts:   { type: Number, default: 0 },                       // failed attempt counter
  createdAt:  { type: Date,   default: Date.now, expires: 600 },  // TTL: 10 min
});

otpSchema.index({ identifier: 1, type: 1 });

module.exports = mongoose.model("Otp", otpSchema);
