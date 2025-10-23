#!/usr/bin/env node
import dotenv from "dotenv";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Resolve paths correctly for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

async function main() {
  const paymentId = process.argv[2];
  if (!paymentId) {
    console.error("Usage: node markPaymentSuccessAndTriggerWebhook.js <paymentId>");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env (payment-service)");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    console.error("Payment not found:", paymentId);
    process.exit(1);
  }

  // Update payment to success
  payment.status = "success";
  payment.paidAt = new Date();
  payment.paidAmount = payment.amount;
  await payment.save();
  console.log("Updated payment to success:", paymentId);

  // Build a test webhook payload that the webhook handler will accept as a test (no signature)
  const payload = {
    code: "00",
    status: "SUCCESS",
    data: {
      status: "SUCCESS",
      amount: payment.amount,
      description: `PayOS test txn:${payment.transactionId}`,
    },
  };

  // Call local payment-service webhook endpoint
  const webhookUrl = process.env.PAYMENT_WEBHOOK_LOCAL || "http://localhost:5004/api/payment/webhook/payos";

  try {
    // node >=18 provides global fetch; if not available this will fail and user can POST manually
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("Webhook response status:", res.status);
    console.log(text);
  } catch (err) {
    console.error("Failed to call webhook endpoint:", err.message);
    console.error("You can instead POST the payload to:", webhookUrl);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
