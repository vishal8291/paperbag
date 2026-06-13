const express = require("express");
const router = express.Router();
const {
  createStore,
  getMyStore,
  updateMyStore,
  getStoreBySlug,
  getAllStores,
} = require("../controllers/storeController");
const { protect, adminOnly, sellerOnly } = require("../middleware/auth");

// Public routes
router.get("/slug/:slug", getStoreBySlug);

// Protected routes (require login)
router.post("/", protect, createStore);
router.get("/my", protect, sellerOnly, getMyStore);
router.put("/my", protect, sellerOnly, updateMyStore);

// Admin routes
router.get("/", protect, adminOnly, getAllStores);

module.exports = router;
