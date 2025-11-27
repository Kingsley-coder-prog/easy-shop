const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets.js");
import { PRODUCT_CATEGORIES } from "../utils/enum.js";
import { v4 as uuidv4 } from "uuid";

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

// if (!CATEGORY_ENUM.includes(newData.category)) {
//   return { error: "Invalid category", allowed: CATEGORY_ENUM };
// }

// async function getProductsByCategory(category) {
//   const products = await getProducts();
//   return products.filter((p) => p.category === category);
// }

// app.get("/api/products/category/:category", async (req, res) => {
//   res.json(await getProductsByCategory(req.params.category));
// });

// 📌 Get all products
async function getProducts() {
  const sheets = await getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: PRODUCTS_RANGE,
  });

  const rows = response.data.values || [];
  return rows.map((row) => {
    let obj = {};
    HEADERS.forEach((key, i) => (obj[key] = row[i] || ""));
    return obj;
  });
}

// 📌 Create product
// async function createProduct(data) {
//   const sheets = await getSheets();
//   const newRow = HEADERS.map((h) => data[h] || "");

//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SPREADSHEET_ID,
//     range: PRODUCTS_RANGE,
//     valueInputOption: "RAW",
//     requestBody: { values: [newRow] },
//   });

//   return { success: true, message: "Product added successfully" };
// }

async function createProduct(data) {
  const sheets = await getSheets();
  if (!PRODUCT_CATEGORIES.includes(data.category)) {
    return {
      error: `Invalid category. Allowed: ${PRODUCT_CATEGORIES.join(", ")}`,
    };
  }

  const newProduct = {
    product_id: uuidv4(),
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

// 📌 Update product by ID
async function updateProduct(product_id, newData) {
  const products = await getProducts();
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

// 📌 Delete product
async function deleteProduct(product_id) {
  const products = await getProducts();
  const index = products.findIndex((p) => p.product_id == product_id);
  if (index === -1) return { error: "Product not found" };

  const rowNumber = index + 2;
  const sheets = await getSheets();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  return { success: true }; // return value
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
