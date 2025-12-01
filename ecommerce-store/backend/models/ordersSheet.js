const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");
// import { v4 as uuidv4 } from "uuid";
const { ORDER_STATUS } = require("../utils/enum");
const { generateUUID } = require("../utils/uuid.js");

const ORDERS_RANGE = "Orders!A2:Z"; // Start reading from row 2

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

// Convert Row ➜ Object
function rowToObject(row) {
  return HEADERS.reduce((obj, key, i) => {
    obj[key] = row[i] || "";
    return obj;
  }, {});
}

// Convert Object ➜ Row
function objectToRow(obj) {
  return HEADERS.map((key) => obj[key] || "");
}

// Get All Orders
async function getOrdersService(filterStatus = null) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: ORDERS_RANGE,
  });

  const rows = res.data.values || [];
  let orders = rows.map((row) => rowToObject(row));

  if (filterStatus) {
    orders = orders.filter(
      (o) => o.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }
  return orders;
}

// Create Order (Insert New Row)
async function createOrderService(data) {
  const sheets = await getSheets();

  // Validate Status
  if (!ORDER_STATUS.includes(data.status)) {
    data.status = "Pending";
  }

  const newOrder = {
    order_id: generateUUID(),
    user_name: data.user_name || "",
    email: data.email || "",
    items_json: JSON.stringify(data.items_json || []),
    amount_naira: Number(data.amount_naira) || 0,
    status: data.status,
    created_at: new Date().toISOString(),
    stripe_session_id: data.stripe_session_id || "",
  };

  const newRow = objectToRow(newOrder);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: ORDERS_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [newRow] },
  });

  return {
    message: "Order added successfully",
    order: { ...newOrder, items_json: JSON.parse(newOrder.items_json) },
  };
}

// Update Order (by order_id)
async function updateOrderService(order_id, newData) {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.order_id == order_id);
  if (index === -1) return { error: "Order not found" };

  const rowNumber = index + 2; // +2 because data starts at row 2
  const sheets = await getSheets();

  // Merge old values with new ones
  const updatedOrder = { ...orders[index], ...newData };
  updatedOrder.items_json = JSON.stringify(updatedOrder.items_json || []);

  const updatedRow = objectToRow(updateOrder);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Orders!A${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [updatedRow] },
  });

  console.log("Searching for order:", order_id);
  console.log("Index found:", index);

  return { message: "Order updated", order: updateOrder };
}

// Delete Order (by order_id)
async function deleteOrderService(order_id) {
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
              sheetId: 1,
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
  getOrdersService,
  createOrderService,
  updateOrderService,
  deleteOrderService,
};
