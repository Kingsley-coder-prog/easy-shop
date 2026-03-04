const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  EMAIL_FROM,
  ADMIN_EMAIL,
} = process.env;

if (!AWS_REGION || !EMAIL_FROM) {
  console.warn(
    "SES email service not fully configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, EMAIL_FROM in env.",
  );
}

const sesClient = new SESClient({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

// Load and compile templates
const templatesDir = path.join(__dirname, "templates");
let orderReceivedTpl = null;
let orderReadyTpl = null;
try {
  const r = fs.readFileSync(
    path.join(templatesDir, "order_received.hbs"),
    "utf8",
  );
  const ready = fs.readFileSync(
    path.join(templatesDir, "order_ready.hbs"),
    "utf8",
  );
  orderReceivedTpl = handlebars.compile(r);
  orderReadyTpl = handlebars.compile(ready);
} catch (err) {
  console.warn("Failed to load email templates:", err.message);
}

async function sendMail(to, subject, html) {
  if (!sesClient) return;
  const params = {
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    Message: {
      Body: { Html: { Charset: "UTF-8", Data: html } },
      Subject: { Charset: "UTF-8", Data: subject },
    },
    Source: EMAIL_FROM,
  };

  try {
    const cmd = new SendEmailCommand(params);
    const resp = await sesClient.send(cmd);
    console.log("SES email sent", resp.MessageId);
    return resp;
  } catch (err) {
    console.error("SES send failed", err);
    throw err;
  }
}

function orderReceivedHtml(order) {
  if (orderReceivedTpl) {
    return orderReceivedTpl({
      name: order.user_name || order.name || "Customer",
      order_id: order.order_id,
      amount_naira: order.amount_naira,
      payment_status: order.payment_status || order.status || "pending",
      order_status: order.order_status || order.status || "pending",
    });
  }
  return `Order ${order.order_id} received`;
}

function orderReadyHtml(order) {
  if (orderReadyTpl) {
    return orderReadyTpl({
      name: order.user_name || order.name || "Customer",
      order_id: order.order_id,
      amount_naira: order.amount_naira,
      payment_status: order.payment_status || order.status || "pending",
      order_status: order.order_status || order.status || "pending",
    });
  }
  return `Order ${order.order_id} is ready`;
}

module.exports = {
  sendMail,
  sendOrderReceived: async (order) => {
    if (!order || !order.email) return;
    return sendMail(
      order.email,
      `Order ${order.order_id} received`,
      orderReceivedHtml(order),
    );
  },
  sendOrderReady: async (order) => {
    console.log("📧 Sending order ready email", {
      order_id: order?.order_id,
      email: order?.email,
    });
    if (!order || !order.email) {
      console.warn("⚠️ Cannot send order ready email: missing order or email", {
        order: order?.order_id,
        email: order?.email,
      });
      return;
    }
    return sendMail(
      order.email,
      `Order ${order.order_id} is ready`,
      orderReadyHtml(order),
    );
  },
  sendAdminAlert: async (subject, html) => {
    if (!ADMIN_EMAIL) return;
    return sendMail(ADMIN_EMAIL, subject, html);
  },
};
