import express from "express";
import {
  createPaymentLink,
  handleWebhook,
  checkPaymentStatus,
} from "../controllers/payment_controller.js";
import { handlePayOSWebhook } from "../controllers/webhook.controller.js";
import { reconcileEnrollmentsFromPayments } from "../controllers/webhook.controller.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const router = express.Router();

// Test endpoint - NO PayOS required
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Payment service is working!",
    timestamp: new Date().toISOString(),
    env: {
      hasClientId: !!process.env.PAYOS_CLIENT_ID,
      hasApiKey: !!process.env.PAYOS_API_KEY,
    },
  });
});

// ✅ ENDPOINT MỚI: Kiểm tra tất cả payments trong database
router.get("/list-all", async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      total: count,
      showing: payments.length,
      payments: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách payments",
      error: error.message,
    });
  }
});

// DEBUG: list enrollments saved in payment-service (for debugging only)
router.get("/debug/enrollments", async (req, res) => {
  try {
    const enrolls = await Enrollment.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, total: enrolls.length, data: enrolls });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching enrollments", error: err.message });
  }
});

// DEBUG: view failed enroll payloads (saved when POST to enroll-service failed)
router.get("/debug/failed-enrolls", async (req, res) => {
  try {
    const file = join(process.cwd(), "failed-enrolls.log");
    const raw = await readFile(file, { encoding: "utf8" }).catch(() => "");
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch (e) {
          return { raw: l };
        }
      });
    res.json({ success: true, total: lines.length, data: lines });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error reading failed-enrolls.log", error: err.message });
  }
});

// DEBUG: replay failed enroll payloads (attempt to POST each payload to ENROLL_SERVICE_URL)
router.post("/debug/replay-failed-enrolls", async (req, res) => {
  try {
    const file = join(process.cwd(), "failed-enrolls.log");
    const raw = await readFile(file, { encoding: "utf8" }).catch(() => "");
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return res.json({ success: true, message: "No failed enrolls to replay" });

    const remaining = [];
    const summary = { total: lines.length, success: 0, failed: 0, errors: [] };

    for (const line of lines) {
      let obj;
      try {
        obj = JSON.parse(line);
      } catch (e) {
        remaining.push(line);
        summary.failed++;
        summary.errors.push({ line, error: "Invalid JSON" });
        continue;
      }

      // payload shape might be { payload: { userId, courseId }, ... } or direct
      const payload = obj.payload || obj.payload?.payload || obj.payload?.body || obj.payload?.data || obj.payload?.payload || obj;
      const enrollPayload = payload.payload || payload || obj.payload || obj.payload?.payload || payload;

      // normalize: look for userId/courseId inside payload or payload.payload
      const candidate = enrollPayload.userId ? enrollPayload : (enrollPayload.payload ? enrollPayload.payload : enrollPayload);

      const body = JSON.stringify({ userId: candidate.userId, courseId: candidate.courseId, status: candidate.status || "active" });

      // attempt POST with retries
      let posted = false;
      let lastErr = null;
      for (let i = 0; i < 3; i++) {
        try {
          const r = await fetch(process.env.ENROLL_SERVICE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body });
          if (r.ok) {
            posted = true;
            break;
          }
          lastErr = new Error(`Status ${r.status}`);
        } catch (e) {
          lastErr = e;
        }
        await new Promise((r) => setTimeout(r, 300 * Math.pow(2, i)));
      }

      if (posted) {
        summary.success++;
      } else {
        summary.failed++;
        summary.errors.push({ original: obj, error: String(lastErr) });
        remaining.push(line);
      }
    }

    // write back remaining failures
    await writeFile(file, remaining.join("\n"), { encoding: "utf8" }).catch(() => {});

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error replaying failed enrolls", error: err.message });
  }
});

// ✅ ENDPOINT MỚI: Xem chi tiết 1 payment
router.get("/detail/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy payment",
      });
    }

    res.json({
      success: true,
      payment: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết payment",
      error: error.message,
    });
  }
});

// Health check with orderId
router.get("/health/:orderId", (req, res) => {
  res.json({
    success: true,
    message: "✅ Endpoint is reachable!",
    orderId: req.params.orderId,
    note: "This is a mock response - PayOS not called",
  });
});

router.post("/create-link", createPaymentLink);
// PayOS may post to /webhook or /webhook/payos depending on configuration
router.post("/webhook", handleWebhook);
router.post("/webhook/payos", handlePayOSWebhook);
// Reconcile endpoint: create missing enrollments from successful payments
router.post("/debug/reconcile-enrolls", reconcileEnrollmentsFromPayments);
router.get("/status/:orderId", checkPaymentStatus);

export default router;
