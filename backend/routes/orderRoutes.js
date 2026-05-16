const express = require("express");
const { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/",              optionalAuth, createOrder);          // COD order (auth optional)
router.get("/my",             protect, getMyOrders);               // user's own orders
router.get("/",               protect, adminOnly, getAllOrders);    // admin: all orders
router.get("/:id",            protect, getOrderById);              // single order
router.put("/:id/status",     protect, adminOnly, updateOrderStatus); // admin: update status

module.exports = router;
