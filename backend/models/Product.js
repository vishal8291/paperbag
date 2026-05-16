const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  price:          { type: Number, required: true, min: 0 },
  description:    { type: String, required: true },
  imageUrl:       { type: String, required: true },
  availableSizes: { type: [String], default: [] },
  ecoFriendly:    { type: Boolean, default: true },
  stock:          { type: Number, default: 0, min: 0 },   // inventory quantity
  category:       { type: String, default: "general", trim: true },
  isActive:       { type: Boolean, default: true },        // soft-delete / hide from listing
}, {
  timestamps: true,
});

// Text index for faster full-text search
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Product', productSchema);
