/**
 * ═══════════════════════════════════════════════════════════════════════
 *  AJMAL & MUHSINA WEDDING — GOOGLE APPS SCRIPT FOR GUEST ATTENDANCE
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * HOW TO SET THIS UP (Takes 2 minutes):
 * 
 * 1. Open Google Sheets (https://sheets.new) and create a new sheet.
 *    Name it e.g. "Ajmal & Muhsina Wedding Guests".
 * 
 * 2. In Google Sheets menu, click:
 *    Extensions > Apps Script
 * 
 * 3. Delete any default code in Code.gs, and PASTE THIS ENTIRE SCRIPT.
 * 
 * 4. Click the blue "Deploy" button at top-right, then select "New deployment".
 * 
 * 5. In the dialog:
 *    - Click the gear icon (⚙️) next to "Select type" and choose "Web app".
 *    - Description: Wedding Guest Counter
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone  <-- (VERY IMPORTANT: must select "Anyone")
 * 
 * 6. Click "Deploy".
 *    (Google may ask for permission: click "Authorize Access", choose your Google
 *    account, click "Advanced", and click "Go to Untitled project (unsafe)" - this is
 *    standard for your own private Apps Script).
 * 
 * 7. Copy the "Web app URL" (it ends with /exec).
 * 
 * 8. Open script.js in your project and paste your URL into:
 *    const GOOGLE_SHEET_SCRIPT_URL = "YOUR_PASTED_URL_HERE";
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

const SHEET_NAME = "Guests";

/**
 * Handles GET requests:
 * - When called with NO parameter: returns the current guest count.
 * - When called WITH ?name=...: appends the guest name to the sheet and returns the updated count.
 */
function doGet(e) {
  return handleGuestRequest(e);
}

/**
 * Handles POST requests:
 * - Also supports JSON payload { "name": "Guest Name" }
 */
function doPost(e) {
  return handleGuestRequest(e);
}

function handleGuestRequest(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 10 seconds to avoid race conditions with multiple guests submitting at the same time
  lock.tryLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Initialize the sheet and headers if not present
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      setupHeader(sheet);
    }

    // Extract guest name from GET query parameter or POST body
    let guestName = "";
    if (e && e.parameter && e.parameter.name) {
      guestName = e.parameter.name;
    } else if (e && e.postData && e.postData.contents) {
      try {
        const body = JSON.parse(e.postData.contents);
        guestName = body.name || "";
      } catch (parseErr) {
        guestName = e.parameter ? e.parameter.name : "";
      }
    }

    // If a guest name was submitted, append it to the sheet
    if (guestName && guestName.trim() !== "") {
      const cleanName = guestName.trim();
      const currentRows = sheet.getLastRow(); // header is row 1
      const serialNumber = Math.max(1, currentRows);
      
      // Timestamp in Indian Standard Time (IST)
      const istTimestamp = Utilities.formatDate(
        new Date(),
        "Asia/Kolkata",
        "dd MMM yyyy, hh:mm:ss a"
      );

      sheet.appendRow([serialNumber, istTimestamp, cleanName]);

      // Auto-align and style new row
      const newRowIdx = sheet.getLastRow();
      sheet.getRange(newRowIdx, 1).setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 2).setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 3).setHorizontalAlignment("left");
    }

    // Total guest count is total rows minus header row
    const totalCount = Math.max(0, sheet.getLastRow() - 1);

    // Retrieve full guest list for the guest-count page
    let guestsList = [];
    if (totalCount > 0) {
      const values = sheet.getRange(2, 1, totalCount, 3).getValues();
      guestsList = values.map(function(row) {
        let timeStr = "";
        if (row[1] instanceof Date) {
          timeStr = Utilities.formatDate(row[1], "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
        } else {
          timeStr = String(row[1] || "");
        }
        return {
          sl: row[0],
          time: timeStr,
          name: String(row[2] || "")
        };
      });
    }

    const response = {
      status: "success",
      count: totalCount,
      guests: guestsList,
      name: guestName ? guestName.trim() : null
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function setupHeader(sheet) {
  sheet.appendRow(["Sl No.", "Timestamp (IST)", "Guest Name"]);
  
  // Elegant styling for wedding sheet header
  const headerRange = sheet.getRange(1, 1, 1, 3);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f7efe3");
  headerRange.setFontColor("#5c3d2e");
  headerRange.setHorizontalAlignment("center");
  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 260);
  sheet.setFrozenRows(1);
}

