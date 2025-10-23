import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { appendFile } from "fs/promises";
import { join } from "path";
import {
  verifyPayOSSignature,
  extractTxnIdFromDescription,
  extractUserCourseFromDescription,
} from "../services/payos.service.js";

export async function handlePayOSWebhook(req, res) {
  try {
    console.log(
      "Received webhook from PayOS:",
      JSON.stringify(req.body, null, 2)
    );
    console.log("Headers:", req.headers);

    const rawBody = req.rawBody || JSON.stringify(req.body || {});
    const signature =
      req.headers["x-checksum"] || req.headers["x-signature"] || "";

    const isTestWebhook =
      !signature ||
      signature === "" ||
      !req.body ||
      Object.keys(req.body).length === 0;

    if (isTestWebhook) {
      console.log(
        "Test webhook detected (no signature) - Processing for testing"
      );
    } else {
      if (!verifyPayOSSignature(rawBody, signature)) {
        console.error("Invalid payOS signature");
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const payload = req.body || {};
    const webhookData = payload.data || payload;
    const code = payload.code || "";
    const status = (payload.status || webhookData.status || "").toUpperCase();
    const amount = Number(webhookData.amount || payload.amount || 0);
    const description = webhookData.description || payload.description || "";
    const orderCode = (
      webhookData.orderCode ||
      webhookData?.payment?.orderCode ||
      payload.orderCode ||
      ""
    ).toString();

    if (code !== "00" && status !== "SUCCESS" && status !== "PAID") {
      console.log(
        "Ignoring non-success webhook, code:",
        code,
        "status:",
        status
      );
      return res.json({ success: true, message: "Ignored non-success status" });
    }

    const transactionId = extractTxnIdFromDescription(description);
    let payment = null;
    if (transactionId) {
      payment = await Payment.findOne({ transactionId });
    }
    // Try resolve by description userId_courseId
    if (!payment) {
      const uc = extractUserCourseFromDescription(description);
      if (uc?.userId && uc?.courseId) {
        payment = await Payment.findOne({
          userId: uc.userId,
          courseId: uc.courseId,
          status: { $in: ["pending", "success"] },
        }).sort({ createdAt: -1 });
      }
    }
    // Fallback to orderCode
    if (!payment && orderCode) {
      payment = await Payment.findOne({
        "paymentDetails.orderCode": orderCode,
      });
    }
    if (!payment) {
      console.log("Payment not found by TXN or orderCode:", {
        transactionId,
        orderCode,
      });

      // If webhook indicates success and description contains userId/courseId, create a payment record
      const uc = extractUserCourseFromDescription(description);
      if (uc?.userId && uc?.courseId) {
        try {
          const newPayment = new Payment({
            userId: uc.userId,
            courseId: uc.courseId,
            amount: amount || 0,
            paymentMethod: "payos",
            status: "success",
            transactionId: transactionId || `auto-${Date.now()}`,
            paymentDetails: { orderCode: orderCode || "" },
            paidAt: new Date(),
            paidAmount: amount || 0,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
          payment = await newPayment.save();
          console.log("Created Payment record from webhook:", payment._id);
        } catch (createErr) {
          console.error("Failed to create Payment from webhook:", createErr);
          return res.status(500).json({ success: false, message: "Failed to create payment record" });
        }
      } else {
        return res.json({ success: true, message: "Payment not found" });
      }
    }

    // helper to POST with retries
    async function postWithRetries(url, payload, attempts = 3) {
      const body = JSON.stringify(payload);
      let lastErr = null;
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
          if (res.ok) return { ok: true, status: res.status };
          lastErr = new Error(`Non-OK status: ${res.status}`);
        } catch (e) {
          lastErr = e;
        }
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)));
      }
      return { ok: false, error: lastErr };
    }

    // use configured enroll service url or fallback to localhost for local dev
    const enrollServiceUrl = process.env.ENROLL_SERVICE_URL || "http://localhost:5003/api/enroll";

    if (payment.status === "success") {
      // Even if payment already marked success, ensure local Enrollment exists
      // and that the central enroll-service has the enrollment (idempotent).
      let createdLocally = false;
      let postedToEnrollService = false;
      try {
        const existing = await Enrollment.findOne({
          userId: payment.userId,
          courseId: payment.courseId,
        });
        if (!existing) {
          await new Enrollment({
            userId: payment.userId,
            courseId: payment.courseId,
          }).save();
          createdLocally = true;
          console.log("Created missing local Enrollment for already-success payment:", payment._id);
        }

        if (enrollServiceUrl) {
          try {
            const enrollPayload = {
              userId: payment.userId,
              courseId: payment.courseId,
              status: "active",
            };
            const result = await postWithRetries(enrollServiceUrl, enrollPayload, 3);
            if (result.ok) {
              postedToEnrollService = true;
              console.log("Confirmed enrollment present on enroll-service for user:", payment.userId);
            } else {
              console.error("Failed to post enrollment after retries:", result.error);
              try {
                const file = join(process.cwd(), "failed-enrolls.log");
                const line = JSON.stringify({
                  at: new Date().toISOString(),
                  payload: enrollPayload,
                  error: String(result.error),
                }) + "\n";
                await appendFile(file, line, { encoding: "utf8" });
                console.log("Saved failed enroll payload to:", file);
              } catch (fsErr) {
                console.error("Failed to write failed-enrolls.log:", fsErr);
              }
            }
          } catch (postErr) {
            console.error("Error posting to Enroll service:", postErr);
          }
        } else {
          console.error("ENROLL_SERVICE_URL not configured in payment-service .env");
        }

        try {
          await fetch(
            `http://localhost:5002/api/courses/${payment.courseId}/increment-students`,
            { method: "POST" }
          );
        } catch (err) {
          console.error("Error incrementing students:", err);
        }
      } catch (err) {
        console.error("Error ensuring enrollment for already-success payment:", err);
      }

      return res.json({
        success: true,
        message: "Already processed",
        paymentId: payment._id,
        paymentStatus: payment.status,
        createdLocally,
        postedToEnrollService,
      });
    }

    if (amount < payment.amount) {
      payment.status = "pending";
      payment.paidAmount = (payment.paidAmount || 0) + amount;
      payment.note = `${payment.note || ""} | payOS partial: ${amount}`;
      await payment.save();
      return res.json({ success: true, message: "Partial amount recorded" });
    }

  payment.status = "success";
  payment.paidAt = new Date();
  payment.paidAmount = amount;
  await payment.save();

  // Flags to report whether enrollment was saved locally and posted to enroll-service
  let createdLocally = false;
  let postedToEnrollService = false;

    try {
      const existing = await Enrollment.findOne({
        userId: payment.userId,
        courseId: payment.courseId,
      });

      if (!existing) {
        await new Enrollment({
          userId: payment.userId,
          courseId: payment.courseId,
        }).save();
        createdLocally = true;

        // Also inform the central Enroll service so frontend (MyCourses) can read enrollments

        try {
          if (enrollServiceUrl) {
            try {
              const enrollPayload = {
                userId: payment.userId,
                courseId: payment.courseId,
                status: "active",
              };
              const result = await postWithRetries(enrollServiceUrl, enrollPayload, 3);
              if (result.ok) {
                postedToEnrollService = true;
                console.log("Posted enrollment to Enroll service for user:", payment.userId);
              } else {
                console.error("Failed to post enrollment after retries:", result.error);
                // Persist failed payload to disk for later manual retry
                try {
                  const file = join(process.cwd(), "failed-enrolls.log");
                  const line = JSON.stringify({
                    at: new Date().toISOString(),
                    payload: enrollPayload,
                    error: String(result.error),
                  }) + "\n";
                  await appendFile(file, line, { encoding: "utf8" });
                  console.log("Saved failed enroll payload to:", file);
                } catch (fsErr) {
                  console.error("Failed to write failed-enrolls.log:", fsErr);
                }
              }
            } catch (postErr) {
              console.error("Error posting to Enroll service:", postErr);
            }
          } else {
            console.error("Enroll service URL is not set and no fallback available");
          }
        } catch (err) {
          console.error("Error informing enroll service:", err);
        }

        try {
          await fetch(
            `http://localhost:5002/api/courses/${payment.courseId}/increment-students`,
            { method: "POST" }
          );
        } catch (err) {
          console.error("Error incrementing students:", err);
        }

        console.log("Enrollment created for user:", payment.userId);
      }
    } catch (err) {
      console.error("Enrollment after payOS error:", err);
    }

    // Build response message to reflect enrollment state
    const resp = {
      success: true,
      paymentId: payment._id,
      paymentStatus: payment.status,
      createdLocally,
      postedToEnrollService,
    };

    if (createdLocally && postedToEnrollService) {
      resp.message = "Payment success and enrollment created (local + enroll-service)";
    } else if (createdLocally && !postedToEnrollService) {
      resp.message = "Payment success; enrollment created locally but NOT propagated to enroll-service";
    } else if (!createdLocally && postedToEnrollService) {
      resp.message = "Payment success; enrollment not created locally (already existed) but enroll-service was notified";
    } else {
      resp.message = "Payment success but enrollment was NOT created locally nor posted to enroll-service";
    }

    return res.json(resp);
  } catch (error) {
    console.error("handlePayOSWebhook error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// Reconcile: create Enrollment entries for payments already marked success but missing enrollments
export async function reconcileEnrollmentsFromPayments(req, res) {
  try {
    const { limit = 100, userId } = req.query;

    const query = { status: "success" };
    if (userId) query.userId = userId;

    const payments = await Payment.find(query).sort({ createdAt: -1 }).limit(Number(limit));

    const summary = { checked: payments.length, created: 0, posted: 0, failed: 0, failures: [] };

    async function postWithRetries(url, payload, attempts = 3) {
      const body = JSON.stringify(payload);
      let lastErr = null;
      for (let i = 0; i < attempts; i++) {
        try {
          const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
          if (r.ok) return { ok: true, status: r.status };
          lastErr = new Error(`Non-OK status: ${r.status}`);
        } catch (e) {
          lastErr = e;
        }
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, i)));
      }
      return { ok: false, error: lastErr };
    }

    for (const p of payments) {
      try {
        const exists = await Enrollment.findOne({ userId: p.userId, courseId: p.courseId });
        if (exists) continue;

        await new Enrollment({ userId: p.userId, courseId: p.courseId }).save();
        summary.created++;

        if (process.env.ENROLL_SERVICE_URL) {
          const payload = { userId: p.userId, courseId: p.courseId, status: "active" };
          const result = await postWithRetries(process.env.ENROLL_SERVICE_URL, payload, 3);
          if (result.ok) {
            summary.posted++;
          } else {
            summary.failed++;
            const file = join(process.cwd(), "failed-enrolls.log");
            const line = JSON.stringify({ at: new Date().toISOString(), payload, error: String(result.error) }) + "\n";
            try {
              await appendFile(file, line, { encoding: "utf8" });
            } catch (fsErr) {
              // ignore
            }
            summary.failures.push({ paymentId: p._id, error: String(result.error) });
          }
        } else {
          summary.failed++;
          summary.failures.push({ paymentId: p._id, error: "ENROLL_SERVICE_URL not configured" });
        }
      } catch (err) {
        summary.failures.push({ paymentId: p._id, error: String(err) });
      }
    }

    return res.json({ success: true, summary });
  } catch (err) {
    console.error("reconcileEnrollmentsFromPayments error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
