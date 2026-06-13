const Store = require("../models/Store");
const mongoose = require("mongoose");

// Resolves req.storeId and req.store based on headers or query params
const resolveTenant = async (req, res, next) => {
  const storeSlug = req.headers["x-store-slug"] || req.query.storeSlug;
  const storeId = req.headers["x-store-id"] || req.query.storeId;

  if (storeId && mongoose.Types.ObjectId.isValid(storeId)) {
    req.storeId = storeId;
    try {
      const store = await Store.findById(storeId);
      if (store) req.store = store;
    } catch (err) {
      console.error("Error fetching store by ID:", err);
    }
  } else if (storeSlug) {
    try {
      const store = await Store.findOne({ slug: storeSlug.toLowerCase().trim() });
      if (store) {
        req.storeId = store._id;
        req.store = store;
      }
    } catch (err) {
      console.error("Error fetching store by slug:", err);
    }
  }

  next();
};

// Strict check for routes that require a tenant context
const requireTenant = (req, res, next) => {
  if (!req.storeId) {
    return res.status(400).json({ message: "Store context is required. Please specify x-store-slug or x-store-id." });
  }
  next();
};

module.exports = { resolveTenant, requireTenant };
