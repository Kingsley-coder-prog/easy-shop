// models/refreshTokensSheet.js
const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");
const { generateUUID } = require("../utils/uuid");

const RANGE = "RefreshTokens!A2:Z";

const HEADERS = [
  "id",
  "user_id",
  "token",
  "expires_at",
  "revoked",
  "created_at",
];

function rowToObject(row) {
  return HEADERS.reduce((obj, key, i) => {
    obj[key] = row[i] || "";
    return obj;
  }, {});
}

function objectToRow(obj) {
  return HEADERS.map((key) => obj[key] || "");
}

// get all refresh tokens
async function getRefreshTokens() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  return (res.data.values || []).map(rowToObject);
}

// create refresh token
async function createRefreshToken(user_id, token, expires_at) {
  const sheets = await getSheets();

  const row = objectToRow({
    id: generateUUID(),
    user_id,
    token,
    expires_at,
    revoked: false,
    created_at: new Date().toISOString(),
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

// find refresh token
async function findRefreshToken(token) {
  const tokens = await getRefreshTokens();
  return tokens.find((t) => t.token === token && t.revoked !== "true");
}

// revoke one token
async function revokeRefreshToken(token) {
  const tokens = await getRefreshTokens();
  const index = tokens.findIndex((t) => t.token === token);
  if (index === -1) return;

  tokens[index].revoked = "true";

  const rowNumber = index + 2;
  const sheets = await getSheets();

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `RefreshTokens!A${rowNumber}:F${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [objectToRow(tokens[index])] },
  });
}

// revoke ALL tokens for user
async function revokeAllUserRefreshTokens(user_id) {
  const tokens = await getRefreshTokens();
  const sheets = await getSheets();

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].user_id === user_id && tokens[i].revoked !== "true") {
      tokens[i].revoked = "true";

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `RefreshTokens!A${i + 2}:F${i + 2}`,
        valueInputOption: "RAW",
        requestBody: { values: [objectToRow(tokens[i])] },
      });
    }
  }
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
};
