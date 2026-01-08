const crypto = require("crypto");
const {
  updateOrderService,
  getOrdersService,
} = require("../models/ordersSheet");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

async function paystackWebhook(req, res) {
  try {
    // 1️⃣ Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    // 2️⃣ Only handle successful charge
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const paymentData = event.data;
    const reference = paymentData.reference;
    const order_id = paymentData.metadata.order_id;

    // 3️⃣ Load order
    const { orders } = await getOrdersService();
    const order = orders.find((o) => o.order_id === order_id);

    if (!order) return res.sendStatus(200);

    // 4️⃣ Safety checks
    if (order.status === "Paid") return res.sendStatus(200);

    if (order.stripe_session_id !== reference) {
      console.error("Webhook reference mismatch");
      return res.sendStatus(200);
    }

    if (paymentData.currency !== "NGN") {
      console.error("Invalid currency");
      return res.sendStatus(200);
    }

    if (paymentData.amount !== Number(order.amount_naira) * 100) {
      console.error("Amount mismatch");
      return res.sendStatus(200);
    }

    // 5️⃣ Mark order as paid
    await updateOrderService(order_id, {
      status: "Paid",
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error("PAYSTACK WEBHOOK ERROR", err);
    return res.sendStatus(500);
  }
}

module.exports = { paystackWebhook };
