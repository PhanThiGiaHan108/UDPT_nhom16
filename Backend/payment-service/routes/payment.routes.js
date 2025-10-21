import express from "express";
import {
  createPayOSPayment,
  checkPayOSPaymentStatus,
} from "../controllers/payos.controller.js";
import { handlePayOSWebhook } from "../controllers/webhook.controller.js";
import { authenticateToken, captureRawBody } from "../middleware/auth.js";

const router = express.Router();

// ========================================
// PAYOS ROUTES
// ========================================

/**
 * 🎯 Tạo link thanh toán PayOS
 * POST /api/payment/payos/create
 * Body: { courseId, amount }
 * Headers: Authorization: Bearer <token>
 */
router.post("/payos/create", authenticateToken, createPayOSPayment);

/**
 * 🔍 Kiểm tra trạng thái thanh toán PayOS
 * GET /api/payment/payos/status?orderCode=xxx
 */
router.get("/payos/status", checkPayOSPaymentStatus);

// ========================================
// WEBHOOK ROUTES
// ========================================

/**
 * 📡 Webhook handler cho PayOS
 * POST /api/payment/webhook/payos
 * KHÔNG cần authentication (webhook từ PayOS server)
 * Cần raw body để verify signature
 */
router.post(
  "/webhook/payos",
  express.raw({ type: "application/json" }),
  captureRawBody,
  handlePayOSWebhook
);

export default router;
