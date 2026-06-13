const express  = require("express");
const router   = express.Router();
const { protect, adminOnly, sellerOnly } = require("../middleware/auth");
const { requireTenant } = require("../middleware/tenant");
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Public — validate coupon at checkout
router.post("/validate", requireTenant, validateCoupon);

// Seller/Admin routes
router.get("/",           protect, sellerOnly, getAllCoupons);
router.post("/",          protect, sellerOnly, requireTenant, createCoupon);
router.patch("/:id/toggle", protect, sellerOnly, toggleCoupon);
router.delete("/:id",    protect, sellerOnly, deleteCoupon);

module.exports = router;
