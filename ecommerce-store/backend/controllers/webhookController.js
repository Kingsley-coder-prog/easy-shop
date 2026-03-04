const crypto = require("crypto");
const {
  updateOrderService,
  getOrdersService,
} = require("../models/ordersSheet");
const { sendOrderReceived } = require("../services/email");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

async function paystackWebhook(req, res) {
  try {
    console.log("🔥 PAYSTACK WEBHOOK RECEIVED");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body.toString());
    // 1️⃣ Verify Paystack signature using RAW body
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.error("Invalid Paystack signature");
      return res.sendStatus(401);
    }

    // 2️⃣ Parse body AFTER signature verification
    const event = JSON.parse(req.body.toString());

    console.log("EVENT:", event.event);

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
    if (order.payment_status === "paid") return res.sendStatus(200);

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

    // 5️⃣ Mark order payment as paid (do NOT change order_status)
    const result = await updateOrderService(order_id, {
      payment_status: "paid",
    });

    // 6️⃣ Send email notification to customer
    try {
      const updatedOrder = result.order || order;
      await sendOrderReceived(updatedOrder);
    } catch (err) {
      console.error("Failed to send order received email", err);
    }

    // 7️⃣ Send admin alert about new payment
    try {
      const { sendAdminAlert } = require("../services/email");
      const adminHtml = `
        <div style="font-family: Arial, Helvetica, sans-serif;">
          <h2>New Payment Received ✅</h2>
          <p>A customer has successfully paid for their order.</p>
          <ul>
            <li><strong>Order ID:</strong> ${order_id}</li>
            <li><strong>Customer Email:</strong> ${order.email}</li>
            <li><strong>Amount:</strong> ₦${order.amount_naira}</li>
            <li><strong>Reference:</strong> ${reference}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>Action: Please process this order and mark as ready when complete.</p>
          <p>— ShopEasy System</p>
        </div>
      `;
      await sendAdminAlert(`New Payment: Order ${order_id}`, adminHtml);
    } catch (err) {
      console.error("Failed to send admin alert", err);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("PAYSTACK WEBHOOK ERROR", err);
    return res.sendStatus(500);
  }
}

module.exports = { paystackWebhook };
