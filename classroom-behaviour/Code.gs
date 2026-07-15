/**
 * Classroom Behaviour Management & De-escalation
 * Google Apps Script backend — logs to a Google Sheet via GET (CORS-safe pixel logging)
 *
 * SETUP:
 * 1. Create a new Google Sheet.
 * 2. Extensions > Apps Script, paste this file in as Code.gs.
 * 3. Deploy > New deployment > Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the /exec URL into SHEET_LOG_URL in app.js.
 * 5. Each time you edit this script, use Deploy > Manage deployments > Edit > New version
 *    to keep the same /exec URL while updating the logic.
 *
 * SHEETS CREATED AUTOMATICALLY (on first request of each type):
 *   - "Responses"   : quiz answers from module pages
 *   - "Assessments" : self-assessment report summaries
 *   - "Enquiries"   : leads from promo.html
 */

function doGet(e) {
  var params = e.parameter;
  var type = params.type || "quiz";

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (type === "enquiry") {
    logEnquiry(ss, params);
  } else if (type === "assessment") {
    logAssessment(ss, params);
  } else {
    logQuiz(ss, params);
  }

  // Return a 1x1 transparent GIF so the <img> pixel request resolves cleanly
  var pixel = Utilities.base64Decode("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7");
  return ContentService.createTextOutput().setMimeType(ContentService.MimeType.TEXT)
    .setContent("");
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function logQuiz(ss, p) {
  var sheet = getOrCreateSheet(ss, "Responses",
    ["Timestamp", "Module", "Question", "Correct"]);
  sheet.appendRow([
    new Date(),
    p.module || "",
    p.question || "",
    p.correct || ""
  ]);
}

function logAssessment(ss, p) {
  var sheet = getOrCreateSheet(ss, "Assessments",
    ["Timestamp", "Name", "Overall Score (%)", "Tier"]);
  sheet.appendRow([
    new Date(),
    p.name || "",
    p.overall || "",
    p.tier || ""
  ]);
}

function logEnquiry(ss, p) {
  var sheet = getOrCreateSheet(ss, "Enquiries",
    ["Timestamp", "Name", "Phone", "Place", "Program Interest", "Source"]);
  sheet.appendRow([
    new Date(),
    p.name || "",
    p.phone || "",
    p.place || "",
    p.interest || "",
    p.source || ""
  ]);
}
