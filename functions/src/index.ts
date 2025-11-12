import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {google} from "googleapis";
import * as cors from "cors";
// FIX: Use an ES module import instead of `require` to load the JSON file.
// This resolves the "Cannot find name 'require'" TypeScript error.
import * as serviceAccount from "../service-account.json";

const corsHandler = cors({origin: true});

admin.initializeApp();
const db = admin.firestore();

// --- ROLE MANAGEMENT ---
export const setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if request is made by an existing admin
  if (context.auth?.token.isAdmin !== true) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can add other admins."
    );
  }

  const {email} = data;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, {isAdmin: true});
    return {message: `Success! ${email} has been made an admin.`};
  } catch (error) {
    throw new functions.https.HttpsError("internal", (error as Error).message);
  }
});


// --- Google Sheets Integration (CRM) ---
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "CRM_Transactions"; // Dedicated CRM sheet

const sheets = google.sheets("v4");
const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
);

export const logTransactionToSheet = functions.https.onRequest(
    async (request, response) => {
      corsHandler(request, response, async () => {
        const {transactionId} = request.body;
        if (!transactionId) {
          response.status(400).send("Missing transactionId");
          return;
        }
        try {
          const txDoc = await db.collection("transactions").doc(transactionId).get();
          if (!txDoc.exists) {
            response.status(404).send("Transaction not found");
            return;
          }
          const txData = txDoc.data() as any;

          const commission = txData.details.total - txData.details.receiveAmount;

          const values = [[
            txData.orderNumber,
            txData.userEmail,
            txData.details.receiveAmount.toFixed(2),
            commission.toFixed(2),
            txData.details.total.toFixed(2),
            txData.recipient.fullName,
            txData.recipient.idNumber,
            txData.recipient.whatsappPhone,
            txData.date.toDate().toLocaleString(),
            txData.status,
          ]];

          // Ensure header row exists
          // This part can be improved, but it's a simple check
          const header = [[
            "Order Number", "User", "Amount Sent", "Commission", "Total Paid",
            "Recipient", "Recipient ID", "WhatsApp", "Date", "Status",
          ]];

          await sheets.spreadsheets.values.append({
            auth: jwtClient,
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {values: header},
          });

          await sheets.spreadsheets.values.append({
            auth: jwtClient,
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2`,
            valueInputOption: "USER_ENTERED",
            requestBody: {values},
          });

          response.status(200).send({success: true});
        } catch (error) {
          functions.logger.error("Error writing to sheet:", error);
          response.status(500).send("Internal Server Error");
        }
      });
    });

// --- Admin & AppSheet Status Updates ---
export const updateTransactionStatusByAdmin = functions.https.onCall(
    async (data, context) => {
      if (context.auth?.token.isAdmin !== true) {
        throw new functions.https.HttpsError(
            "permission-denied", "Must be an admin to update status.");
      }
      const {transactionId, newStatus} = data;
      if (!transactionId || !newStatus) {
        throw new functions.https.HttpsError(
            "invalid-argument", "Missing transactionId or newStatus.");
      }
      try {
        await db.collection("transactions").doc(transactionId)
            .update({status: newStatus});
        return {success: true};
      } catch (error) {
        throw new functions.https.HttpsError("internal", (error as Error).message);
      }
    });

// HTTP-triggered function for Google Apps Script to call
export const updateStatusFromSheet = functions.https.onRequest(
    async (request, response) => {
      // Add a simple API key check for basic security
      const F_API_KEY = functions.config().f_api.key;
      if (request.headers.authorization !== `Bearer ${F_API_KEY}`) {
        response.status(401).send("Unauthorized");
        return;
      }

      const {orderNumber, newStatus} = request.body;
      if (!orderNumber || !newStatus) {
        response.status(400).send("Missing orderNumber or newStatus");
        return;
      }

      try {
        const q = db.collection("transactions")
            .where("orderNumber", "==", orderNumber);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
          response.status(404).send(`Transaction with order ${orderNumber} not found.`);
          return;
        }

        const txDoc = querySnapshot.docs[0];
        await txDoc.ref.update({status: newStatus});

        response.status(200).send({success: true});
      } catch (error) {
        functions.logger.error("Error updating from sheet:", error);
        response.status(500).send("Internal Server Error");
      }
    });

// --- NowPayments Integration ---
const NOWPAYMENTS_API_KEY = functions.config().nowpayments.key;
if (!NOWPAYMENTS_API_KEY) {
  console.error("CRITICAL: NowPayments API key is not set in functions config."+
  " Run 'firebase functions:config:set nowpayments.key=\"YOUR_KEY\"'");
}

export const createNowPaymentsInvoice = functions.https.onRequest(
    async (request, response) => {
      corsHandler(request, response, async () => {
        const {price_amount, price_currency, order_id, order_description} = request.body;
        if (!price_amount || !order_id) {
          response.status(400).send("Missing required payment details.");
          return;
        }
        try {
          const apiResponse = await axios.post(
              "https://api.nowpayments.io/v1/invoice",
              {
                price_amount,
                price_currency,
                order_id,
                order_description,
                ipn_callback_url: "YOUR_CLOUD_FUNCTION_URL/handleNowPaymentsCallback",
              },
              {
                headers: {
                  "x-api-key": NOWPAYMENTS_API_KEY,
                  "Content-Type": "application/json",
                },
              }
          );
          response.status(200).send(apiResponse.data);
        } catch (error) {
          functions.logger.error("NowPayments Error:", error);
          response.status(500).send("Failed to create payment invoice.");
        }
      });
    });

export const handleNowPaymentsCallback = functions.https.onRequest(
    async (request, response) => {
      const {order_id, payment_status} = request.body;
      if (!order_id || !payment_status) {
        response.status(400).send("Invalid callback data.");
        return;
      }
      const transactionRef = db.collection("transactions").doc(order_id);
      try {
        if (payment_status === "finished") {
          await transactionRef.update({status: "En Proceso"});
        } else if (["failed", "expired"].includes(payment_status)) {
          await transactionRef.update({status: "Pendiente"});
        }
        response.status(200).send("Callback handled.");
      } catch (error) {
        functions.logger.error("Callback error:", error);
        response.status(500).send("Error updating transaction.");
      }
    });
