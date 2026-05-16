const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

// GET all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, review, avatar, rating } = req.body;
    const newTestimonial = new Testimonial({ name, role, review, avatar, rating });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
