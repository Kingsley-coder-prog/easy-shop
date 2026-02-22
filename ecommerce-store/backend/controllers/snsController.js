const axios = require("axios");
const { sendAdminAlert } = require("../services/email");

// Handle incoming AWS SNS messages (SubscriptionConfirmation, Notification, UnsubscribeConfirmation)
async function handleSNS(req, res) {
  try {
    const msgType = req.headers["x-amz-sns-message-type"] || req.body.Type;
    const body = req.body || {};

    console.log("SNS message type:", msgType);

    if (
      msgType === "SubscriptionConfirmation" ||
      body.Type === "SubscriptionConfirmation"
    ) {
      const subscribeUrl = body.SubscribeURL || body.SubscribeURL;
      console.log(
        "SNS SubscriptionConfirmation received. Confirming subscription:",
        subscribeUrl,
      );
      if (subscribeUrl) {
        try {
          await axios.get(subscribeUrl);
          console.log("SNS subscription confirmed");
        } catch (err) {
          console.error("Failed to confirm SNS subscription", err.message);
          await sendAdminAlert(
            "SNS subscription confirmation failed",
            `Failed to confirm subscription: ${err.message}`,
          );
        }
      }
      return res.status(200).send("OK");
    }

    if (msgType === "Notification" || body.Type === "Notification") {
      // The actual SES notification is in body.Message (stringified JSON)
      const message =
        typeof body.Message === "string"
          ? JSON.parse(body.Message)
          : body.Message;
      const notificationType =
        message.notificationType || message.notificationType;
      console.log("SES notification type:", notificationType);

      if (notificationType === "Bounce" || notificationType === "Complaint") {
        const recipients = [];
        if (message.bounce && Array.isArray(message.bounce.bouncedRecipients)) {
          message.bounce.bouncedRecipients.forEach((r) =>
            recipients.push(r.emailAddress),
          );
        }
        if (
          message.complaint &&
          Array.isArray(message.complaint.complainedRecipients)
        ) {
          message.complaint.complainedRecipients.forEach((r) =>
            recipients.push(r.emailAddress),
          );
        }

        const unique = Array.from(new Set(recipients));
        console.log("SES bounce/complaint for recipients:", unique);

        // Notify admin with details
        const subject = `SES ${notificationType} for ${unique.length} recipient(s)`;
        const html = `<p>SES ${notificationType} received for these recipients:</p><ul>${unique
          .map((e) => `<li>${e}</li>`)
          .join("")}</ul><pre>${JSON.stringify(message, null, 2)}</pre>`;
        await sendAdminAlert(subject, html);
      }

      return res.status(200).send("OK");
    }

    // For Unsubscribe or other types
    console.log("Unhandled SNS message", body);
    return res.status(200).send("OK");
  } catch (err) {
    console.error("SNS handler error", err);
    return res.status(500).send("Error");
  }
}

module.exports = { handleSNS };
