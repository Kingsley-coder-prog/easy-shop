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
    const { reference } = req.body;

    if (!reference) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "reference is required" });
    }

    const verifyRes = await verifyPayment(reference);

    if (verifyRes.data.status !== "success") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Payment failed" });
    }

    const order_id = verifyRes.data.metadata.order_id;

    await updateOrderService(order_id, {
      status: "Paid",
    });

    return res.status(StatusCodes.OK).json({ message: "Payment successful" });
  } catch (err) {
    console.error("PAYSTACK VERIFY ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createPayment,
  verifyPaymentCallback,
};
