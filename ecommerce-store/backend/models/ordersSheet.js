const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");
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
  let orders = rows.map((row) => {
    const order = rowToObject(row);
    try {
      order.items_json = JSON.parse(order.items_json);
    } catch (err) {
      order.items_json = [];
    }

    return order;
  });

  if (filterStatus) {
    orders = orders.filter(
      (o) => o.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }
  return { numberOfOrders: orders.length, orders };
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
  const { orders } = await getOrdersService();
  const index = orders.findIndex((o) => o.order_id == order_id);
  if (index === -1) return { error: "Order not found" };

  const rowNumber = index + 2; // +2 because data starts at row 2
  const sheets = await getSheets();

  // Merge old values with new ones
  const updatedOrder = { ...orders[index], ...newData };
  updatedOrder.items_json = JSON.stringify(updatedOrder.items_json || []);

  const updatedRow = objectToRow(updatedOrder);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Orders!A${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [updatedRow] },
  });

  try {
    updatedOrder.items_json = JSON.parse(updatedOrder.items_json);
  } catch (err) {
    updatedOrder.items_json = [];
  }

  return { message: "Order updated", order: updatedOrder };
}

// Delete Order (by order_id)
async function deleteOrderService(order_id) {
  try {
    console.log("Deleting order:", order_id);

    const result = await getOrdersService(); // <-- result = { numberOfOrders, orders: [...] }
    const orders = result.orders; // <-- extract the array

    console.log("Orders loaded:", orders.length);

    if (!Array.isArray(orders)) {
      throw new Error("Orders is not an array");
    }

    const index = orders.findIndex((o) => o.order_id == order_id);
    console.log("Index found:", index);

    if (index === -1) {
      return { error: "Order not found" };
    }

    // Spreadsheet rows start at 1, header is row 1, first order is row 2
    const rowNumber = index + 2;

    // GET SHEET ID CORRECTLY
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

    return { success: true, message: "Order deleted" };
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    throw err;
  }
}

async function getOrdersSheetId() {
  const sheets = await getSheets();
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = metadata.data.sheets.find(
    (s) => s.properties.title === "Orders"
  );

  if (!sheet) throw new Error("Orders sheet not found");

  return sheet.properties.sheetId;
}

module.exports = {
  getOrdersService,
  createOrderService,
  updateOrderService,
  deleteOrderService,
};
