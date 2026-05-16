const express    = require("express");
const router     = express.Router();
const Subscriber = require("../models/Subscriber");

// ── POST /api/newsletter  (subscribe) ─────────────────────────
router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.isActive) {
        return res.status(409).json({ message: "You are already subscribed!" });
      }
      // Re-subscribe
      existing.isActive        = true;
      existing.subscribedAt    = new Date();
      existing.unsubscribedAt  = null;
      await existing.save();
      return res.json({ message: "Welcome back! You have been re-subscribed." });
    }

    await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ message: "Subscribed successfully! 🌿 Thank you." });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed. Please try again." });
  }
});

// ── POST /api/newsletter/unsubscribe ──────────────────────────
router.post("/unsubscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber || !subscriber.isActive) {
      return res.status(404).json({ message: "Email not found in our subscriber list." });
    }

    subscriber.isActive       = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({ message: "You have been unsubscribed successfully. We're sad to see you go! 💚" });
  } catch (err) {
    res.status(500).json({ message: "Unsubscribe failed. Please try again." });
  }
});

// Legacy alias kept for backward compat
router.post("/subscribe", async (req, res) => {
  req.url = "/";
  router.handle(req, res, () => {});
});

module.exports = router;
