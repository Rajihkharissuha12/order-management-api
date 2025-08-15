const express = require("express");
const {
  createProduk,
  updateProduk,
  deleteProduk,
  getAllProduk,
} = require("../controller/produkController");
const { verifyTokenAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Register
router.post("/create", verifyTokenAdmin, createProduk);
router.put("/update/:id", verifyTokenAdmin, updateProduk);
router.delete("/delete/:id", verifyTokenAdmin, deleteProduk);
router.get("/getAll", verifyTokenAdmin, getAllProduk);

module.exports = router;
