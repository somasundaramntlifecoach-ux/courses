/**
 * Google Apps Script backend for the "Emotional Intelligence for Teachers"
 * EQ Self-Assessment tool (assessment.html).
 *
 * SETUP:
 * 1. Go to script.google.com > New Project. Paste this entire file in.
 * 2. Deploy > New deployment > type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the deployment URL (ends in /exec).
 * 4. Paste that URL into GAS_URL near the top of assessment.html's <script> section.
 *
 * This uses a simple GET request (image-pixel pattern) so it works from any
 * static HTML page without CORS issues.
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('EQ_Responses');
    if (!sheet) {
      sheet = ss.insertSheet('EQ_Responses');
      sheet.appendRow([
        'Timestamp', 'Name', 'Mobile', 'School',
        'Total %', 'Level',
        'Self-Awareness %', 'Self-Regulation %', 'Empathy %', 'Social Skills %', 'Motivation %',
        'Language'
      ]);
      sheet.setFrozenRows(1);
    }

    const p = e.parameter;
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.mobile || '',
      p.school || '',
      p.total || '',
      p.level || '',
      p.sa || '', p.sr || '', p.em || '', p.ss || '', p.mo || '',
      p.lang || ''
    ]);

    // Return a 1x1 transparent gif so the <img> logging pattern doesn't error.
    const blob = Utilities.newBlob(
      Utilities.base64Decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7'),
      'image/gif'
    );
    return blob;
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message);
  }
}
