const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getMe,
  updateUserProfile,
  toggleWishlist,
  getWishlist,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Public ─────────────────────────────────────────────────────
router.post("/register",          registerUser);
router.post("/login",             loginUser);
router.post("/google",            googleAuth);

// ── OTP auth ───────────────────────────────────────────────────
router.post("/send-otp",          sendOtp);
router.post("/verify-otp",        verifyOtp);
router.post("/forgot-password",   forgotPassword);
router.post("/reset-password",    resetPassword);

// ── Protected (require JWT) ────────────────────────────────────
router.post("/logout",            protect, logoutUser);
router.get("/me",                 protect, getMe);
router.put("/profile",            protect, updateUserProfile);
router.get("/wishlist",           protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);

module.exports = router;
