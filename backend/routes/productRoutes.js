const express = require("express");
const router  = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

// Cloudinary upload (falls back to local if not configured)
let upload;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const { uploadToCloud } = require("../config/cloudinary");
    upload = uploadToCloud;
  } else {
    upload = require("../middleware/upload");
  }
} catch {
  upload = require("../middleware/upload");
}

// ── GET /api/products ─────────────────────────────────────────
// Supports: search, eco, sort, page, limit
router.get("/", async (req, res) => {
  try {
    const { search, eco, sort, page = 1, limit = 20, category } = req.query;
    const filter = { isActive: { $ne: false } }; // hide soft-deleted products

    if (search) {
      // Use text index if available; fall back to case-insensitive regex
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (eco === "true") filter.ecoFriendly = true;
    if (category && category !== "all") filter.category = { $regex: category, $options: "i" };

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip     = (pageNum - 1) * limitNum;

    let query = Product.find(filter);
    if (sort === "priceAsc")  query = query.sort({ price:  1 });
    if (sort === "priceDesc") query = query.sort({ price: -1 });
    if (sort === "newest")    query = query.sort({ createdAt: -1 });

    const [products, total] = await Promise.all([
      query.skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page:       pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/products (admin only) ──────────────────────────
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, imageUrl, availableSizes, ecoFriendly, category, stock } = req.body;

    let finalImageUrl;
    if (req.file) {
      // Cloudinary returns req.file.path; local disk returns filename
      finalImageUrl = req.file.path || `${process.env.SERVER_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
    } else if (imageUrl?.trim()) {
      finalImageUrl = imageUrl;
    } else {
      return res.status(400).json({ message: "Please provide an image file or URL." });
    }

    const product = await Product.create({
      name,
      price:          parseFloat(price),
      description,
      imageUrl:       finalImageUrl,
      availableSizes: availableSizes ? JSON.parse(availableSizes) : [],
      ecoFriendly:    ecoFriendly === "true",
      category:       category || "general",
      stock:          stock !== undefined ? parseInt(stock, 10) : 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ── PUT /api/products/:id (admin only) ───────────────────────
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, availableSizes, ecoFriendly, category, stock } = req.body;
    const updatedData = {
      name,
      price:          parseFloat(price),
      description,
      ecoFriendly:    ecoFriendly === "true",
      availableSizes: availableSizes ? JSON.parse(availableSizes) : undefined,
      ...(category !== undefined && { category }),
      ...(stock    !== undefined && { stock: parseInt(stock, 10) }),
    };
    if (req.file) {
      updatedData.imageUrl = req.file.path || `${process.env.SERVER_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product." });
  }
});

// ── DELETE /api/products/:id (admin only) ────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
