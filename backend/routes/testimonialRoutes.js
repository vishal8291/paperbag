const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const { requireTenant } = require("../middleware/tenant");

// GET all testimonials for this store
router.get("/", requireTenant, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ storeId: req.storeId });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new testimonial for this store
router.post("/", requireTenant, async (req, res) => {
  try {
    const { name, role, review, avatar, rating } = req.body;
    const newTestimonial = new Testimonial({ storeId: req.storeId, name, role, review, avatar, rating });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
