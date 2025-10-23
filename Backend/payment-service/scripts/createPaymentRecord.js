#!/usr/bin/env node
import dotenv from "dotenv";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 4) {
    console.error("Usage: node createPaymentRecord.js <userId> <courseId> <amount> <transactionId> [status]");
    process.exit(1);
  }

  const [userId, courseId, amountStr, transactionId, statusArg] = args;
  const amount = Number(amountStr) || 0;
  const status = statusArg || "success"; // default to success when creating to reconcile

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const payload = {
    userId,
    courseId,
    amount,
    transactionId,
    paymentMethod: "payos",
    status,
    paymentDetails: { orderCode: "manual-create" },
    paidAt: status === "success" ? new Date() : undefined,
    paidAmount: status === "success" ? amount : 0,
    expiresAt,
  };

  const p = new Payment(payload);
  await p.save();
  console.log("Created payment:", p._id.toString());

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
