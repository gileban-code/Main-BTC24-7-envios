// This code should be pasted into the Google Apps Script editor associated with your Google Sheet.
// Go to Extensions > Apps Script in your Google Sheet.

// IMPORTANT: Replace with the URL of your deployed `updateStatusFromSheet` cloud function.
const FIREBASE_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL/updateStatusFromSheet'; 
// IMPORTANT: Replace with a secret key you define in your Firebase function's environment variables.
// In your terminal, run: firebase functions:config:set f_api.key="YOUR_SECRET_KEY_HERE"
const API_KEY = 'YOUR_SECRET_KEY_HERE'; 

// The name of the sheet you are monitoring
const SHEET_TO_WATCH = 'CRM_Transactions';
// The column number for the 'Order Number' (Column A is 1)
const ORDER_NUMBER_COLUMN = 1; 
// The column number for the 'Status' (Column J is 10)
const STATUS_COLUMN = 10; 


/**
 * This function runs automatically whenever a user edits the spreadsheet.
 * @param {Object} e The event object.
 */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  
  // Check if the edit was in the correct sheet and in the 'Status' column.
  if (sheet.getName() === SHEET_TO_WATCH && range.getColumn() === STATUS_COLUMN && range.getRow() > 1) {
    
    // Get the new status value from the edited cell.
    const newStatus = range.getValue();
    
    // Get the order number from the same row.
    const orderNumber = sheet.getRange(range.getRow(), ORDER_NUMBER_COLUMN).getValue();
    
    // If we have an order number, call the Firebase function.
    if (orderNumber) {
      updateFirebase(orderNumber, newStatus);
    }
  }
}

/**
 * Calls the Firebase Cloud Function to update the transaction status in Firestore.
 * @param {string} orderNumber The unique order number of the transaction.
 * @param {string} newStatus The new status to set ('En Proceso', 'Entregado', etc.).
 */
function updateFirebase(orderNumber, newStatus) {
  const payload = {
    orderNumber: orderNumber,
    newStatus: newStatus
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Prevents script from stopping on HTTP errors
  };
  
  try {
    // Make the HTTP request to the Cloud Function
    const response = UrlFetchApp.fetch(FIREBASE_FUNCTION_URL, options);
    Logger.log('Response from Firebase: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error calling Firebase function: ' + error.toString());
  }
}

/**
 * You need to set up a trigger for this script to run automatically.
 * 1. In the Apps Script editor, click on the "Triggers" icon (looks like a clock).
 * 2. Click "+ Add Trigger" in the bottom right.
 * 3. Choose the function to run: `onEdit`.
 * 4. Choose which deployment should run: `Head`.
 * 5. Select event source: `From spreadsheet`.
 * 6. Select event type: `On edit`.
 * 7. Click "Save".
 * You will be asked to authorize the script's permissions. Please allow them.
 */
