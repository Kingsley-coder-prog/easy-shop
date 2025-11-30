console.log("Testing imports...");

try {
  const { PRODUCT_CATEGORIES } = require("./utils/enum.js");
  console.log("✅ enum.js import works");

  const { generateUUID } = require("./utils/uuid.js");
  console.log("✅ uuid.js import works");

  const { getSheets, SPREADSHEET_ID } = require("./services/googleSheets.js");
  console.log("✅ googleSheets.js import works");

  console.log("PRODUCT_CATEGORIES:", PRODUCT_CATEGORIES);
  console.log("Generated UUID:", generateUUID());
  console.log("SPREADSHEET_ID:", SPREADSHEET_ID);
} catch (error) {
  console.error("❌ Import error:", error.message);
}
