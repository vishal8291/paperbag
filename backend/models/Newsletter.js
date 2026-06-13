const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index to ensure email uniqueness per store
newsletterSchema.index({ storeId: 1, email: 1 }, { unique: true });

module.exports = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
