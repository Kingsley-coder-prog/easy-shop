const express = require("express");
const router = express.Router();
const {
  createPayment,
  verifyPaymentCallback,
} = require("../controllers/paymentController");
const { auth } = require("../middlewares/authMiddleware");

// Initialize payment
router.post("/create", auth, createPayment);

// Callback / webhook
router.post("/verify", verifyPaymentCallback);

module.exports = router;
