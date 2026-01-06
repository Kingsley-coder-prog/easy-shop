const { StatusCodes } = require("http-status-codes");
const { initializePayment, verifyPayment } = require("../services/paystack");
const { getOrders, updateOrder } = require("../models/ordersSheet");

async function createPayment(req, res) {
  try {
    const { order_id } = req.body;
    const orders = await getOrders();
    const order = orders.find((o) => o.order_id === order_id);
    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });

    const amount_kobo = Number(order.amount_naira) * 100;

    const paystackRes = await initializePayment(
      order.email,
      amount_kobo,
      order_id
    );

    const auth_url = paystackRes.data.authorization_url;
    const reference = paystackRes.data.reference;

    // Save reference in your order record
    await updateOrder(order_id, { stripe_session_id: reference });

    return res.status(StatusCodes.OK).json({ auth_url, reference });
  } catch (err) {
    console.error("PAYMENT INIT ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function verifyPaymentCallback(req, res) {
  try {
    const { reference } = req.body;
    const verifyRes = await verifyPayment(reference);

    if (verifyRes.data.status === "success") {
      const order_id = verifyRes.data.metadata.order_id;

      await updateOrder(order_id, { status: "ready" });

      return res.status(StatusCodes.OK).json({ message: "Payment successful" });
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Payment failed" });
  } catch (err) {
    console.error("PAYSTACK VERIFY ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createPayment, verifyPaymentCallback };
