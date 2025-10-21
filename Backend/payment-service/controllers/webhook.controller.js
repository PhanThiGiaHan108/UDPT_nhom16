import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
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
      return res.json({ success: true, message: "Payment not found" });
    }

    if (payment.status === "success") {
      return res.json({ success: true, message: "Already processed" });
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

    return res.json({
      success: true,
      message: "Payment success and enrollment created",
    });
  } catch (error) {
    console.error("handlePayOSWebhook error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
