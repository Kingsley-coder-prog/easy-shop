const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const {
  createPayment,
  verifyPaymentCallback,
} = require("../controllers/paymentController");

const router = express.Router();

// Initialize payment
router.post("/create", auth, createPayment);

// Callback / webhook
router.post("/verify", verifyPaymentCallback);

module.exports = router;
