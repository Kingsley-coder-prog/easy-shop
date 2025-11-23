const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");

const ORDERS_RANGE = "Orders!A2:Z"; // Start reading from row 2
// const SHEET_ID = 1; // ⚠️ CHANGE THIS — check your sheet tabs index!

// Order table headers — MUST MATCH YOUR SHEET HEADERS
const HEADERS = [
  "order_id",
  "user_name",
  "email",
  "items_json",
  "amount_naira",
  "status",
  "created_at",
  "stripe_session_id",
];

// 📌 Get All Orders
async function getOrders() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: ORDERS_RANGE,
  });

  const rows = res.data.values || [];
  return rows.map((row) => {
    let obj = {};
    HEADERS.forEach((key, i) => (obj[key] = row[i] || ""));
    return obj;
  });
}

// 📌 Create Order (Insert New Row)
async function createOrder(data) {
  const sheets = await getSheets();
  const newRow = HEADERS.map((h) => data[h] || "");

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: ORDERS_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [newRow] },
  });

  return { success: true, message: "Order added successfully" };
}

// 📌 Update Order (by order_id)
async function updateOrder(order_id, newData) {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.order_id == order_id);
  if (index === -1) return { error: "Order not found" };

  const rowNumber = index + 2; // +2 because data starts at row 2
  const sheets = await getSheets();

  const updatedRow = HEADERS.map((h) => newData[h] || orders[index][h]);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Orders!A${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [updatedRow] },
  });

  return { success: true, message: "Order updated" };
}

// 📌 Delete Order (by order_id)
async function deleteOrder(order_id) {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.order_id == order_id);
  if (index === -1) return { error: "Order not found" };

  const rowNumber = index + 2;

  const sheets = await getSheets();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 1, // ⚠️ CHECK THIS ID!!!
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  return { success: true, message: "Order deleted" };
}

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
