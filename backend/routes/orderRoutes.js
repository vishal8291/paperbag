const express = require("express");
const { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { protect, adminOnly, sellerOnly, optionalAuth } = require("../middleware/auth");
const { requireTenant } = require("../middleware/tenant");

const router = express.Router();

router.post("/",              requireTenant, optionalAuth, createOrder);          // COD order (tenant required)
router.get("/my",             requireTenant, protect, getMyOrders);               // user's own orders for this store
router.get("/",               protect, sellerOnly, getAllOrders);                 // seller/admin: all orders for store
router.get("/:id",            protect, getOrderById);                              // single order
router.put("/:id/status",     protect, sellerOnly, updateOrderStatus);            // seller/admin: update status

module.exports = router;
