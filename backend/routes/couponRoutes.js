const express  = require("express");
const router   = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Public — validate coupon at checkout
router.post("/validate", validateCoupon);

// Admin routes
router.get("/",           protect, adminOnly, getAllCoupons);
router.post("/",          protect, adminOnly, createCoupon);
router.patch("/:id/toggle", protect, adminOnly, toggleCoupon);
router.delete("/:id",    protect, adminOnly, deleteCoupon);

module.exports = router;
