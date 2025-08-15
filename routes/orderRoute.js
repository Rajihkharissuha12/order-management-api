const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrderHistory,
} = require("../controller/orderController");

// Customer membuat order
router.post("/create", verifyToken, createOrder);

// Customer melihat riwayat order
router.get("/history", verifyToken, getOrderHistory);

module.exports = router;
