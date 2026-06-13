const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { requireTenant } = require("../middleware/tenant");

// POST /api/contact
router.post("/", requireTenant, async (req, res) => {
  try {
    const { fullName, name, email, message } = req.body;
    const resolvedName = name || fullName;
    if (!resolvedName || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const contact = new Contact({
      storeId: req.storeId,
      name: resolvedName,
      email,
      message,
    });
    await contact.save();
    res.status(201).json({ message: "Message received!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving contact" });
  }
});

module.exports = router;
