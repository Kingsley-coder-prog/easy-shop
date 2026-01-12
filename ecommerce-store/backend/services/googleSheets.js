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
const fs = require("fs");
const path = require("path");

let auth;

// Initialize authentication based on environment
if (process.env.GOOGLE_SERVICE_KEY) {
  // Production: Use environment variable
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_KEY);
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
} else {
  // Development: Use local JSON file
  auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../google-service-key.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
module.exports = { getSheets, SPREADSHEET_ID };
