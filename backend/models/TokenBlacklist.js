const mongoose = require("mongoose");

// Stores revoked JWTs until they naturally expire.
// MongoDB TTL index auto-deletes each document when the token's expiry passes.
const tokenBlacklistSchema = new mongoose.Schema({
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date,   required: true },
});

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
