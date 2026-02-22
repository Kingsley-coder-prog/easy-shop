const express = require("express");
const router = express.Router();
const { paystackWebhook } = require("../controllers/webhookController");
const { handleSNS } = require("../controllers/snsController");

router.post("/paystack", paystackWebhook);
// AWS SNS endpoint for SES notifications (bounce/complaint/subscription)
router.post(
  "/sns",
  express.json({ type: ["application/json", "text/plain"] }),
  handleSNS,
);

// Test endpoint: simulate SNS bounce notification (for local dev/testing)
router.get("/test-sns/bounce", (req, res) => {
  const mockBounceSNS = {
    Type: "Notification",
    Message: JSON.stringify({
      notificationType: "Bounce",
      bounce: {
        bounceType: "Transient",
        bouncedRecipients: [
          {
            emailAddress: "bounced@example.com",
            status: "4.4.2",
            diagnosticCode: "smtp; 421 Service not available",
          },
        ],
        timestamp: new Date().toISOString(),
        bounceSubType: "ServiceUnavailable",
      },
      mail: {
        timestamp: new Date().toISOString(),
        source: process.env.EMAIL_FROM || "noreply@example.com",
        sourceArn: "arn:aws:ses:us-east-1:123456789012:identity/example.com",
        sendingAccountId: "123456789012",
        messageId: "test-message-" + Date.now(),
        destination: ["bounced@example.com"],
      },
    }),
  };
  // Call handleSNS as if SNS sent this
  req.body = mockBounceSNS;
  handleSNS(req, res).catch((err) =>
    res.status(500).json({ error: err.message }),
  );
});

// Test endpoint: simulate SNS complaint notification
router.get("/test-sns/complaint", (req, res) => {
  const mockComplaintSNS = {
    Type: "Notification",
    Message: JSON.stringify({
      notificationType: "Complaint",
      complaint: {
        complainedRecipients: [{ emailAddress: "complained@example.com" }],
        timestamp: new Date().toISOString(),
        complaintFeedbackType: "abuse",
      },
      mail: {
        timestamp: new Date().toISOString(),
        source: process.env.EMAIL_FROM || "noreply@example.com",
        sourceArn: "arn:aws:ses:us-east-1:123456789012:identity/example.com",
        sendingAccountId: "123456789012",
        messageId: "test-message-" + Date.now(),
        destination: ["complained@example.com"],
      },
    }),
  };
  req.body = mockComplaintSNS;
  handleSNS(req, res).catch((err) =>
    res.status(500).json({ error: err.message }),
  );
});

module.exports = router;
