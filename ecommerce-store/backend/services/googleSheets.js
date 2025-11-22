// const { google } = require("googleapis");
// const sheets = google.sheets("v4");
// const path = require("path");
// const fs = require("fs");

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.resolve(__dirname, "../google-service-key.json"), // your JSON key
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// async function getAuthClient() {
//   return await auth.getClient();
// }

// module.exports = { sheets, getAuthClient };

const { google } = require("googleapis");
// const sheets = google.sheets("v4");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../google-service-key.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
module.exports = { getSheets, SPREADSHEET_ID };
