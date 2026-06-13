const express  = require("express");
const mongoose = require("mongoose");
const Review   = require("../models/Review");
const Product  = require("../models/Product");
const { protect, optionalAuth } = require("../middleware/auth");
const { requireTenant } = require("../middleware/tenant");

const router = express.Router({ mergeParams: true }); // mergeParams gives access to :productId

// ── GET /api/reviews/:productId ───────────────────────────────
router.get("/:productId", requireTenant, optionalAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const reviews = await Review.find({ productId, storeId: req.storeId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const total  = reviews.length;
    const avg    = total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0;

    // Rating distribution
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });

    res.json({ reviews, total, avg, dist });
  } catch {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

// ── POST /api/reviews/:productId ─────────────────────────────
router.post("/:productId", requireTenant, protect, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // Verify product belongs to active store
    const product = await Product.findOne({ _id: productId, storeId: req.storeId });
    if (!product) {
      return res.status(404).json({ message: "Product not found in this store." });
    }

    const { rating, review, name } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    if (!review?.trim()) {
      return res.status(400).json({ message: "Review text is required." });
    }

    const safeName   = String(name   || req.user.name || "Anonymous").replace(/[<>"']/g, "").trim().slice(0, 80);
    const safeReview = String(review).replace(/[<>"']/g, "").trim().slice(0, 500);

    // Upsert — update existing review if user already reviewed this product in this store
    const saved = await Review.findOneAndUpdate(
      { productId, userId: req.user.id, storeId: req.storeId },
      { productId, userId: req.user.id, storeId: req.storeId, name: safeName, rating: Number(rating), review: safeReview },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ message: "Review saved!", review: saved });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this product." });
    }
    res.status(500).json({ message: "Failed to save review." });
  }
});

module.exports = router;
