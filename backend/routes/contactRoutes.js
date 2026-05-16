const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const contact = new Contact({ fullName, email, phone, subject, message });
    await contact.save();
    res.status(201).json({ message: "Message received!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving contact" });
  }
});

module.exports = router;
