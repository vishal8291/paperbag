const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },   // optional — Google OAuth users have no password
    mobile:   { type: String, default: "" },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String },   // Google OAuth sub
    avatar:   { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // Login lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil:           { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
