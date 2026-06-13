const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  name: { type: String, required: true },
  role: { type: String, default: "Customer" },            // NEW FIELD
  review: { type: String, required: true },
  avatar: { type: String, default: "/default-avatar.png" },
  rating: { type: Number, default: 5, min: 1, max: 5 },   // NEW FIELD
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
