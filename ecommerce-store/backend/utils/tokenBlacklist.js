// const blacklistedTokens = new Set();

// function blacklistToken(token) {
//   blacklistedTokens.add(token);
// }

// function isTokenBlacklisted(token) {
//   return blacklistedTokens.has(token);
// }

// module.exports = {
//   blacklistToken,
//   isTokenBlacklisted,
// };

const { getSheets, SPREADSHEET_ID } = require("../services/googleSheets");

const RANGE = "BlacklistedTokens!A2:C";

async function blacklistToken(token, expiresAt) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    requestBody: {
      values: [[token, expiresAt, new Date().toISOString()]],
    },
  });
}

async function isTokenBlacklisted(token) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values || [];
  return rows.some((row) => row[0] === token);
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};
