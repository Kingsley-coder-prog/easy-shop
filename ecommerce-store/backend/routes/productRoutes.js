const express = require("express");
const router = express.Router();
const { getProducts, addProduct } = require("../models/productsSheet");

// GET /products
router.get("/", async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

// POST /products
router.post("/", async (req, res) => {
  const result = await addProduct(req.body);
  res.json(result);
});

module.exports = router;
