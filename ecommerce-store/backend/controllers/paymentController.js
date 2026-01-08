const { StatusCodes } = require("http-status-codes");
const { initializePayment, verifyPayment } = require("../services/paystack");
const {
  getOrdersService,
  updateOrderService,
} = require("../models/ordersSheet");

async function createPayment(req, res) {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "order_id is required" });
    }

    // ✅ USE SERVICE (not controller)
    const { orders } = await getOrdersService();

    const order = orders.find((o) => o.order_id === order_id);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Only pending orders can be paid for",
      });
    }

    const amount_kobo = Number(order.amount_naira) * 100;

    const paystackRes = await initializePayment(
      order.email,
      amount_kobo,
      order_id
    );

    const { authorization_url, reference } = paystackRes.data;

    // ✅ Save Paystack reference on order
    await updateOrderService(order_id, {
      stripe_session_id: reference,
    });

    return res.status(StatusCodes.OK).json({
      authorization_url,
      reference,
    });
  } catch (err) {
    console.error("PAYMENT INIT ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function verifyPaymentCallback(req, res) {
  try {
    // Paystack usually sends reference as query param on redirect
    const reference = req.query.reference || req.body.reference;

    if (!reference) {
      return res.status(400).json({ error: "reference is required" });
    }

    // 1️⃣ Verify transaction with Paystack
    const verifyRes = await verifyPayment(reference);

    const paymentData = verifyRes.data.data;

    if (!paymentData || paymentData.status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    // 2️⃣ Extract order_id from metadata
    const order_id = paymentData.metadata?.order_id;

    if (!order_id) {
      return res.status(400).json({ error: "Order ID missing from metadata" });
    }

    // 3️⃣ Fetch order from Google Sheets
    const { orders } = await getOrdersService();
    const order = orders.find((o) => o.order_id === order_id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 4️⃣ SECURITY CHECK: Ensure reference matches stored order reference
    if (order.stripe_session_id !== reference) {
      return res.status(400).json({ error: "Reference mismatch" });
    }

    // 5️⃣ SECURITY CHECK: Ensure currency is NGN
    if (paymentData.currency !== "NGN") {
      return res.status(400).json({ error: "Invalid currency" });
    }

    // 6️⃣ SECURITY CHECK: Ensure amount matches exactly
    const expectedAmount = Number(order.amount_naira) * 100; // kobo
    const paidAmount = paymentData.amount;

    if (paidAmount !== expectedAmount) {
      console.error("AMOUNT MISMATCH", {
        order_id,
        expectedAmount,
        paidAmount,
      });

      return res.status(400).json({ error: "Payment amount mismatch" });
    }

    // 7️⃣ Prevent double payment
    if (order.status === "Paid") {
      return res.status(200).json({
        message: "Order already marked as paid",
      });
    }

    // 8️⃣ Mark order as paid
    await updateOrderService(order_id, {
      status: "Paid",
    });

    return res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    console.error("PAYSTACK VERIFY ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createPayment,
  verifyPaymentCallback,
};
