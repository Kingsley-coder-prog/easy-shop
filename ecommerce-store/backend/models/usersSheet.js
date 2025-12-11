// models/usersSheet.js
const { USER_ROLE } = require("../utils/enum.js");
const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");
const { generateUUID } = require("../utils/uuid");
const bcrypt = require("bcryptjs");

// Sheet config
const USERS_RANGE = "Users!A2:Z";
const USERS_SHEET_NAME = "Users"; // used by getSheetId helper

const HEADERS = [
  "user_id",
  "name",
  "email",
  "password_hash",
  "role",
  "created_at",
];

/* ---------------------------
   Row <-> Object helpers
   --------------------------- */
function rowToObject(row) {
  return HEADERS.reduce((obj, key, i) => {
    obj[key] = row[i] || "";
    return obj;
  }, {});
}

function objectToRow(obj) {
  return HEADERS.map((key) => obj[key] || "");
}

/* ---------------------------
   Sheet helpers
   --------------------------- */
async function getSheetIdByName(sheetName) {
  const sheets = await getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find((s) => s.properties.title === sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  return sheet.properties.sheetId;
}

/* ---------------------------
   Get all users (optionally exclude password_hash for responses)
   --------------------------- */
async function getUsers() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: USERS_RANGE,
  });

  const rows = res.data.values || [];
  const users = rows.map(rowToObject);

  // parse created_at to consistent string (optional)
  users.forEach((u) => {
    if (u.created_at) u.created_at = u.created_at;
  });

  return users;
}

/* ---------------------------
   Find single user by email (returns object or null)
   --------------------------- */
async function findUserByEmail(email) {
  const users = await getUsers();
  return (
    users.find(
      (u) => (u.email || "").toLowerCase() === (email || "").toLowerCase()
    ) || null
  );
}

/* ---------------------------
   Find by user_id
   --------------------------- */
async function findUserById(user_id) {
  const users = await getUsers();
  return users.find((u) => u.user_id === user_id) || null;
}

/* ---------------------------
   Create user (hash password, auto id, created_at)
   returns created user object (password_hash present)
   --------------------------- */
async function createUser({ name, email, password, role }) {
  // simple validation
  if (!name || !email || !password) {
    return { status: 400, error: "name, email and password are required" };
  }

  const existing = await findUserByEmail(email);
  if (existing) return { status: 409, error: "Email already exists" };

  const finalRole = USER_ROLE.includes(role) ? role : "user";
  const user = {
    user_id: generateUUID(),
    name,
    email,
    password_hash: await bcrypt.hash(password, 10),
    role: finalRole,
    created_at: new Date().toISOString(),
  };

  const sheets = await getSheets();
  const newRow = objectToRow(user);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: USERS_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [newRow] },
  });

  return { message: "user created successfully", user };
}

/* ---------------------------
   Update user fields (name, role, password)
   admin can update role; if password provided it will be hashed
   --------------------------- */
async function updateUser(
  user_id,
  newData,
  options = { allowRoleChange: false }
) {
  const users = await getUsers();
  const index = users.findIndex((u) => u.user_id === user_id);
  if (index === -1) return { status: 404, error: "User not found" };

  const existing = users[index];

  // apply updates
  const updated = { ...existing };
  if (newData.name !== undefined) updated.name = newData.name;
  if (newData.email !== undefined) updated.email = newData.email; // be careful: should ensure uniqueness in production
  if (newData.password !== undefined) {
    updated.password_hash = await bcrypt.hash(newData.password, 10);
  }
  if (newData.role !== undefined) {
    if (!options.allowRoleChange)
      return { status: 403, error: "Role change not allowed" };
    if (!USER_ROLE.includes(newData.role))
      return {
        status: 400,
        error: `Role must be one of ${USER_ROLE.join(",")}`,
      };
    updated.role = newData.role;
  }

  // write entire row back
  const rowNumber = index + 2; // because header occupies row 1
  const sheets = await getSheets();
  const row = objectToRow(updated);

  // compute end column letter for HEADERS length (A..)
  function colLetterFromIndex(n) {
    let s = "";
    while (n > 0) {
      const m = (n - 1) % 26;
      s = String.fromCharCode(65 + m) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }
  const endCol = colLetterFromIndex(HEADERS.length);
  const range = `Users!A${rowNumber}:${endCol}${rowNumber}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  // do not return password_hash in controller responses if not necessary
  return { status: 200, user: updated };
}

/* ---------------------------
   Delete user - IMPLEMENT Option C:
   If deleted user is admin, and no admin remains after deletion,
   auto-promote the oldest remaining user (by created_at) to admin.
   --------------------------- */
async function deleteUser(user_id) {
  const users = await getUsers();
  const index = users.findIndex((u) => u.user_id === user_id);
  if (index === -1) return { status: 404, error: "User not found" };

  const deletedUser = users[index];

  // Delete row
  const rowNumber = index + 2;
  const sheets = await getSheets();
  const sheetId = await getSheetIdByName(USERS_SHEET_NAME);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  // After deletion, check if any admin remains
  const remaining = await getUsers();
  const hasAdmin = remaining.some((u) => u.role === "admin");

  if (!hasAdmin && remaining.length > 0) {
    // promote oldest by created_at
    const oldest = remaining.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )[0];
    // update role to admin
    await updateUser(
      oldest.user_id,
      { role: "admin" },
      { allowRoleChange: true }
    );
    return {
      status: 200,
      message: `User deleted. Promoted ${oldest.email} to admin.`,
    };
  }

  return { status: 200, message: "User deleted", deletedUser };
}

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
