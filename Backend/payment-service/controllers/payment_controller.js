import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import Payment from "../models/Payment.js";

dotenv.config();

const PAYOS_API = "https://api-merchant.payos.vn/v2/payment-requests";

// ✅ Tạo link thanh toán
export const createPaymentLink = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    const { userId, courseId, amount } = req.body;

    console.log("📌 Parsed values:", {
      userId,
      courseId,
      amount,
      type: typeof amount,
    });

    if (!userId || !courseId || !amount) {
      console.log("❌ Missing data:", {
        hasUserId: !!userId,
        hasCourseId: !!courseId,
        hasAmount: !!amount,
      });
      return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
    }

    const orderCode = Date.now(); // Mã đơn hàng duy nhất

    // ✅ Tạo transactionId duy nhất
    const transactionId = `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // ✅ PayOS giới hạn description = 25 ký tự, chỉ chấp nhận A-Z0-9
    // Dùng 10 ký tự cuối mỗi ID
    const shortUser = String(userId).slice(-10).toUpperCase();
    const shortCourse = String(courseId).slice(-10).toUpperCase();
    const description = `U${shortUser}C${shortCourse}`; // Format: U<userId>C<courseId>

    // ✅ Ensure amount is integer
    const finalAmount = parseInt(amount);

    // ✅ Lưu Payment vào database TRƯỚC khi gọi PayOS
    const payment = new Payment({
      userId,
      courseId,
      amount: finalAmount,
      paymentMethod: "payos",
      status: "pending",
      transactionId,
      paymentDetails: {
        orderCode: orderCode.toString(),
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Hết hạn sau 15 phút
      note: `PayOS payment for course ${courseId} - ${userId}_${courseId}`,
    });

    console.log("🔄 Đang lưu payment vào MongoDB...");
    const savedPayment = await payment.save();
    console.log("✅ ĐÃ LƯU THÀNH CÔNG payment vào database!");
    console.log("📄 Payment ID:", savedPayment._id);
    console.log("📄 Transaction ID:", savedPayment.transactionId);
    console.log("📄 Status:", savedPayment.status);

    // Kiểm tra lại xem payment có trong database không
    const checkPayment = await Payment.findById(savedPayment._id);
    if (checkPayment) {
      console.log("✅ XÁC NHẬN: Payment đã có trong database!");
    } else {
      console.log("❌ CẢNH BÁO: Không tìm thấy payment sau khi lưu!");
    }

    // ✅ Payload PayOS V2 - KHÔNG CẦN items array
    const payosData = {
      orderCode: Number(orderCode),
      amount: finalAmount,
      description: description,
      returnUrl:
        process.env.PAYOS_RETURN_URL || "http://localhost:5173/payment-success",
      cancelUrl:
        process.env.PAYOS_CANCEL_URL || "http://localhost:5173/payment-cancel",
    };

    // ✅ Tạo signature (checksum) theo yêu cầu PayOS
    const dataStr = `amount=${payosData.amount}&cancelUrl=${payosData.cancelUrl}&description=${payosData.description}&orderCode=${payosData.orderCode}&returnUrl=${payosData.returnUrl}`;
    const signature = crypto
      .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY)
      .update(dataStr)
      .digest("hex");

    // ✅ Thêm signature vào payload
    const paymentPayload = {
      ...payosData,
      signature: signature,
    };

    console.log("🔍 Signature string:", dataStr);
    console.log("🔐 Signature:", signature);

    console.log("� Signature string:", dataStr);
    console.log("🔐 Signature:", signature);

    console.log("�📤 Sending to PayOS:", {
      api: PAYOS_API,
      payload: paymentPayload,
      headers: {
        "x-client-id": process.env.PAYOS_CLIENT_ID ? "***" : "MISSING",
        "x-api-key": process.env.PAYOS_API_KEY ? "***" : "MISSING",
      },
    });

    const response = await axios.post(PAYOS_API, paymentPayload, {
      headers: {
        "x-client-id": process.env.PAYOS_CLIENT_ID,
        "x-api-key": process.env.PAYOS_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log(
      "📦 PayOS Full Response:",
      JSON.stringify(response.data, null, 2)
    );

    const checkoutUrl =
      response.data?.data?.checkoutUrl ||
      response.data?.checkoutUrl ||
      response.data?.paymentUrl ||
      response.data?.url;

    if (!checkoutUrl) {
      console.error("❌ No checkout URL found in response:", response.data);

      // ❌ Xóa payment nếu tạo link thất bại
      console.log("❌ TẠO LINK THẤT BẠI - Đang xóa payment...");
      await Payment.findByIdAndDelete(savedPayment._id);
      console.log("🗑️ Đã xóa payment do tạo link thất bại");

      return res.status(500).json({
        message: "PayOS không trả về link thanh toán!",
        details: response.data,
      });
    }

    // ✅ Cập nhật payment với thông tin từ PayOS
    console.log("🔄 Đang cập nhật payment với thông tin từ PayOS...");
    savedPayment.paymentDetails.paymentLinkId =
      response.data?.data?.paymentLinkId;
    savedPayment.paymentDetails.qrCodeUrl = response.data?.data?.qrCode;
    await savedPayment.save();

    console.log("✅ Tạo link PayOS thành công:", checkoutUrl);
    console.log("💾 Đã cập nhật payment với paymentLinkId");

    // Kiểm tra lại lần cuối
    const finalCheck = await Payment.findById(savedPayment._id);
    console.log("🔍 KIỂM TRA CUỐI CÙNG:");
    console.log("  - Payment ID:", finalCheck?._id);
    console.log("  - Status:", finalCheck?.status);
    console.log("  - Amount:", finalCheck?.amount);
    console.log("  - Created:", finalCheck?.createdAt);

    res.json({
      checkoutUrl,
      paymentId: savedPayment._id,
      transactionId,
      orderCode,
    });
  } catch (err) {
    console.error("❌ PayOS Error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
    });

    // ❌ Xóa payment nếu có lỗi trong quá trình tạo
    console.log("❌ CÓ LỖI - Đang tìm và xóa payment...");
    try {
      const failedPayment = await Payment.findOne({
        transactionId: transactionId, // Dùng biến transactionId đã tạo ở trên
      });
      if (failedPayment) {
        console.log("🗑️ Tìm thấy payment để xóa:", failedPayment._id);
        await Payment.findByIdAndDelete(failedPayment._id);
        console.log("🗑️ Đã xóa payment do có lỗi");
      } else {
        console.log("⚠️ Không tìm thấy payment để xóa");
      }
    } catch (deleteErr) {
      console.error("⚠️ Lỗi khi xóa payment:", deleteErr);
    }

    res.status(500).json({
      message: "Không thể tạo liên kết thanh toán!",
      error: err.response?.data || err.message,
    });
  }
};

// ✅ Xử lý webhook PayOS → Cập nhật payment status và ghi danh tự động
export const handleWebhook = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Dữ liệu webhook không hợp lệ!" });
    }

    const { orderCode, amount, status, description } = data;
    console.log(`📩 Webhook từ PayOS: ${orderCode} - ${status}`);

    // ✅ Tìm payment trong database theo orderCode
    const payment = await Payment.findOne({
      "paymentDetails.orderCode": orderCode.toString(),
    });

    if (!payment) {
      console.log(`⚠️ Không tìm thấy payment với orderCode: ${orderCode}`);
      return res.status(404).json({ message: "Không tìm thấy thanh toán!" });
    }

    // ✅ Cập nhật status của payment
    if (status === "PAID") {
      payment.status = "success";
      payment.paidAt = new Date();
      payment.paidAmount = amount;
      await payment.save();
      console.log(`💰 Đã cập nhật payment ${payment._id} thành công`);

      // ✅ Gửi request sang Enroll Service để ghi danh khóa học
      console.log("🎓 Đang ghi danh khóa học...");
      console.log(`  - User ID: ${payment.userId}`);
      console.log(`  - Course ID: ${payment.courseId}`);
      console.log(`  - Enroll URL: ${process.env.ENROLL_SERVICE_URL}`);

      if (process.env.ENROLL_SERVICE_URL) {
        try {
          const enrollResponse = await axios.post(
            process.env.ENROLL_SERVICE_URL,
            {
              userId: payment.userId,
              courseId: payment.courseId,
              status: "active",
            }
          );
          console.log(
            `✅ GHI DANH THÀNH CÔNG cho user ${payment.userId} vào course ${payment.courseId}`
          );
          console.log("📦 Enroll response:", enrollResponse.data);
        } catch (enrollErr) {
          console.error("❌ LỖI KHI GHI DANH:");
          console.error("   Message:", enrollErr.message);
          console.error("   Response:", enrollErr.response?.data);
          console.error("   Status:", enrollErr.response?.status);
        }
      } else {
        console.error("❌ ENROLL_SERVICE_URL chưa được cấu hình trong .env!");
      }
    } else if (status === "CANCELLED") {
      payment.status = "cancelled";
      await payment.save();
      console.log(`❌ Payment ${payment._id} đã bị hủy`);
    } else if (status === "FAILED") {
      payment.status = "failed";
      await payment.save();
      console.log(`❌ Payment ${payment._id} thất bại`);
    }

    res.status(200).json({ message: "Webhook đã nhận và xử lý" });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).json({ message: "Lỗi khi xử lý webhook!" });
  }
};

// ✅ Kiểm tra trạng thái thanh toán (từ database và PayOS)
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã đơn hàng!",
      });
    }

    console.log(`🔍 Kiểm tra trạng thái đơn hàng: ${orderId}`);

    // ✅ Tìm payment trong database trước
    const payment = await Payment.findOne({
      "paymentDetails.orderCode": orderId.toString(),
    });

    if (payment) {
      console.log(`💾 Tìm thấy payment trong database: ${payment._id}`);
      return res.json({
        success: true,
        status: payment.status,
        amount: payment.amount,
        transactionId: payment.transactionId,
        paymentId: payment._id,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        paymentMethod: payment.paymentMethod,
      });
    }

    // ⚠️ Nếu không tìm thấy trong database, thử gọi PayOS API
    console.log("⚠️ Không tìm thấy trong database, gọi PayOS API...");

    if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY) {
      console.error("❌ Thiếu PayOS credentials!");
      return res.status(500).json({
        success: false,
        status: "error",
        message: "Server chưa cấu hình PayOS credentials!",
      });
    }

    const { data } = await axios.get(`${PAYOS_API}/${orderId}`, {
      headers: {
        "x-client-id": process.env.PAYOS_CLIENT_ID,
        "x-api-key": process.env.PAYOS_API_KEY,
      },
    });

    console.log(`📦 PayOS Response:`, JSON.stringify(data, null, 2));

    if (!data || !data.data) {
      console.error("❌ Invalid PayOS response structure:", data);
      throw new Error("Invalid response from PayOS API");
    }

    res.json({
      success: true,
      status: data.data.status,
      amount: data.data.amount,
      description: data.data.description,
      orderCode: data.data.orderCode,
    });
  } catch (err) {
    console.error(
      "❌ Lỗi kiểm tra trạng thái:",
      err.response?.data || err.message
    );

    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        status: "not_found",
        message: "Không tìm thấy giao dịch này!",
      });
    }

    res.status(500).json({
      success: false,
      status: "error",
      message:
        err.response?.data?.message ||
        "Không thể kiểm tra trạng thái thanh toán!",
      error: err.message,
    });
  }
};
