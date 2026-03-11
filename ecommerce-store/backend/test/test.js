const assert = require("assert");

console.log("Running backend smoke checks...");

try {
  const {
    PRODUCT_CATEGORIES,
    ORDER_STATUS,
    PAYMENT_STATUS,
  } = require("../utils/enum.js");
  const { generateUUID } = require("../utils/uuid.js");

  assert(
    Array.isArray(PRODUCT_CATEGORIES),
    "PRODUCT_CATEGORIES should be an array",
  );
  assert(Array.isArray(ORDER_STATUS), "ORDER_STATUS should be an array");
  assert(Array.isArray(PAYMENT_STATUS), "PAYMENT_STATUS should be an array");

  const uuid = generateUUID();
  assert(
    typeof uuid === "string" && uuid.length > 0,
    "generateUUID() should return a non-empty string",
  );

  console.log("✅ Backend smoke checks passed");
  process.exit(0);
} catch (error) {
  console.error("❌ Backend smoke checks failed:", error.message);
  process.exit(1);
}
