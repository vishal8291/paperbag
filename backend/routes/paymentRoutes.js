const express = require("express");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", optionalAuth, createRazorpayOrder);
router.post("/verify",       optionalAuth, verifyPayment);

module.exports = router;
