// run: node checkSheetIds.js

require("dotenv").config();
const { google } = require("googleapis");
const path = require("path");

async function getSheetIDs() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "google-service-key.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
  });

  res.data.sheets.forEach((sheet) => {
    console.log(
      `TITLE: ${sheet.properties.title} ➤ ID: ${sheet.properties.sheetId}`
    );
  });
}

getSheetIDs();
