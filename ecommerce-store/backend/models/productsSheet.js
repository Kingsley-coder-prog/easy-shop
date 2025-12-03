const { PRODUCT_CATEGORIES } = require("../utils/enum.js");
const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets.js");
const { generateUUID } = require("../utils/uuid.js");

const PRODUCTS_RANGE = "Products!A2:Z";

const HEADERS = [
  "product_id",
  "name",
  "price_naira",
  "description",
  "category",
  "image",
  "created_at",
];

// Get all products
async function getProductsService(filterCategory = null) {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: PRODUCTS_RANGE,
  });

  const rows = response.data.values || [];
  let products = rows.map((row) => {
    let obj = {};
    HEADERS.forEach((key, i) => (obj[key] = row[i] || ""));
    return obj;
  });

  if (filterCategory) {
    products = products.filter(
      (p) => p.category.toLowerCase() === filterCategory.toLowerCase()
    );
  }
  return products;
}

async function createProductService(data) {
  const sheets = await getSheets();
  if (!PRODUCT_CATEGORIES.includes(data.category)) {
    return {
      error: `Invalid category. Allowed: ${PRODUCT_CATEGORIES.join(", ")}`,
    };
  }

  const newProduct = {
    product_id: generateUUID(),
    name: data.name || "",
    price_naira: data.price_naira || 0,
    description: data.description || "",
    image: data.image || "",
    category: data.category || "",
    created_at: new Date().toISOString(),
  };

  const newRow = HEADERS.map((h) => newProduct[h] || "");

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: PRODUCTS_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [newRow] },
  });

  return { message: "Product created successfully", product: newProduct };
}

// Update product by ID
async function updateProductService(product_id, newData) {
  const products = await getProductsService();
  const index = products.findIndex((p) => p.product_id == product_id);
  if (index === -1) return { error: "Product not found" };

  const rowNumber = index + 2;
  const sheets = await getSheets();

  const rowValues = HEADERS.map((h) => newData[h] || products[index][h]);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Products!A${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [rowValues] },
  });

  console.log("Searching for product:", product_id);
  console.log("Index found:", index);

  return { success: true, message: "Product updated" };
}

// Delete product
async function deleteProductService(product_id) {
  const products = await getProductsService();
  const index = products.findIndex((p) => p.product_id == product_id);
  if (index === -1) return { error: "Product not found" };

  const rowNumber = index + 2;
  const sheetId = await getOrdersSheetId();
  const sheets = await getSheets();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  return { success: true, message: `Product ${product_id} deleted` };
}

async function getOrdersSheetId() {
  const sheets = await getSheets();
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = metadata.data.sheets.find(
    (s) => s.properties.title === "Products"
  );

  if (!sheet) throw new Error("Orders sheet not found");

  return sheet.properties.sheetId;
}

module.exports = {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
};
