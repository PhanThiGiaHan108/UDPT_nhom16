import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// Cấu hình thông tin kết nối PayOS
const CLIENT_ID = process.env.PAYO_CLIENT_ID || "1e1d7719-e347-4a5c-81da-9a933f00bee7";
const API_KEY = process.env.PAYO_API_KEY || "d8733fa5-a242-42ef-a8cc-691fcea9cd84";
const CHECKSUM_KEY = process.env.PAYO_CHECKSUM_KEY || "2b8e589750ff2f0261edf96afc00b5db8c1cf9353fec3ccd231b89b3e8aa7ef9";
const PAYO_API_URL = process.env.PAYO_API_URL || "https://payment-provider.example/api/payments";
const WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL || "https://jaylee-vainglorious-decadally.ngrok-free.dev/api/payment/webhook/payos";

// Endpoint kiểm tra trạng thái giao dịch (demo: luôn trả về thành công)
router.get("/status/:id", async (req, res) => {
	try {
		const { id } = req.params;
		// Demo: luôn trả về trạng thái thành công
		res.json({ status: "success", id, amount: 100000 });
	} catch (err) {
		res.status(500).json({ status: "error", message: err.message });
	}
});

// Endpoint tạo thanh toán
router.post("/pay", async (req, res) => {
	try {
		const { orderId, amount, currency = "VND", returnUrl } = req.body;
		const payload = { clientId: CLIENT_ID, orderId, amount, currency, returnUrl, webhookUrl: WEBHOOK_URL };
		const checksum = crypto.createHmac("sha256", CHECKSUM_KEY).update(JSON.stringify(payload)).digest("hex");
		const headers = {
			"Content-Type": "application/json",
			"X-Client-Id": CLIENT_ID,
			"X-Api-Key": API_KEY,
			"X-Checksum": checksum
		};
		const resp = await axios.post(PAYO_API_URL, payload, { headers, timeout: 10000 });
		res.json(resp.data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Endpoint nhận webhook từ PayOS
router.post("/webhook/payos", express.json({ type: "application/json" }), async (req, res) => {
	try {
		const signatureHeader = req.headers["x-checksum"] || req.headers["x-signature"] || "";
		const rawBody = req.body && typeof req.body === "object" ? JSON.stringify(req.body) : req.body;
		const computed = crypto.createHmac("sha256", CHECKSUM_KEY).update(rawBody).digest("hex");
		if (!signatureHeader || computed !== signatureHeader) {
			return res.status(400).send("invalid signature");
		}
		// TODO: xử lý payload: cập nhật trạng thái đơn hàng, ghi log, gửi sự kiện nội bộ...
		console.log("Valid webhook received:", req.body);
		res.status(200).send("OK");
	} catch (err) {
		console.error("Webhook error", err);
		res.status(500).send("error");
	}
});

export default router;
