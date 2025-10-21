import crypto from "crypto";
import Payment from "../models/Payment.js";

/**
 * 🎯 TẠO LINK THANH TOÁN PAYOS
 * POST /api/payment/payos/create
 */
export async function createPayOSPayment(req, res) {
  try {
    const { amount, courseId } = req.body;

    // ✅ Lấy userId từ JWT token (req.user được set bởi middleware)
    const userId = req.user?.id || req.user?._id;

    // ✅ Validate input
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId và userId là bắt buộc",
      });
    }

    // ✅ Lấy thông tin PayOS từ env
    const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
    const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
    const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

    if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
      return res.status(500).json({
        success: false,
        message: "PayOS chưa được cấu hình. Vui lòng kiểm tra .env",
      });
    }

    // ✅ Lấy thông tin khóa học từ course-service
    const courseRes = await fetch(
      `http://localhost:5002/api/courses/${courseId}`
    );
    if (!courseRes.ok) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }
    const course = await courseRes.json();

    // Note: Không cần kiểm tra user vì đã có JWT token
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // ✅ Tạo transaction ID duy nhất
    const transactionId = `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const paymentAmount = amount || course.price;
    const orderCode = Date.now(); // Unique order code

    // ✅ Mô tả theo yêu cầu: <idHọcViên>_<idKhóaHọc>
    // Nhưng PayOS giới hạn 25 ký tự ⇒ dùng 10 ký tự cuối mỗi id: 10 + 1 + 10 = 21
    // Ví dụ: <...last10>_<...last10>
    const shortUser = String(userId).slice(-10).toUpperCase();
    const shortCourse = String(courseId).slice(-10).toUpperCase();
    // Dùng ký tự chữ cái thay cho dấu phân cách để phù hợp quy tắc hiển thị của PayOS
    // Ví dụ: UABCDEF1234C9876543210 (<= 1+10+1+10 = 22)
    const description = `U${shortUser}C${shortCourse}`; // chỉ A-Z0-9

    // ✅ Lưu payment vào database TRƯỚC
    const payment = new Payment({
      userId,
      courseId,
      amount: paymentAmount,
      paymentMethod: "payos",
      status: "pending",
      transactionId,
      paymentDetails: {
        orderCode: orderCode.toString(),
        paymentLinkId: "", // Sẽ cập nhật sau khi tạo link
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Hết hạn sau 5 phút
      note: `${transactionId} - ${course.title} - ${userId}_${courseId}`, // lưu mapping đầy đủ trong note
    });

    await payment.save();

    // ✅ Tạo payment link với PayOS API
    const payosData = {
      orderCode: orderCode,
      amount: paymentAmount,
      description: description,
      returnUrl: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment-success?paymentId=${payment._id}`,
      cancelUrl: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment-cancel?paymentId=${payment._id}`,
    };

    // ✅ Tạo checksum (signature) cho request
    const dataStr = `amount=${payosData.amount}&cancelUrl=${payosData.cancelUrl}&description=${payosData.description}&orderCode=${payosData.orderCode}&returnUrl=${payosData.returnUrl}`;
    const signature = crypto
      .createHmac("sha256", PAYOS_CHECKSUM_KEY)
      .update(dataStr)
      .digest("hex");

    // ✅ Gọi PayOS API
    try {
      const response = await fetch(
        "https://api-merchant.payos.vn/v2/payment-requests",
        {
          method: "POST",
          headers: {
            "x-client-id": PAYOS_CLIENT_ID,
            "x-api-key": PAYOS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payosData,
            signature: signature,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.code !== "00") {
        console.error("❌ PayOS API Error:", result);

        // Xóa payment nếu tạo link thất bại
        await Payment.findByIdAndDelete(payment._id);

        return res.status(400).json({
          success: false,
          message: result.desc || "Không thể tạo link thanh toán PayOS",
          error: result,
        });
      }

      // ✅ Cập nhật payment với thông tin từ PayOS
      payment.paymentDetails.paymentLinkId = result.data.paymentLinkId;
      await payment.save();

      // ✅ Trả về thông tin cho Frontend
      return res.json({
        success: true,
        paymentId: payment._id,
        transactionId,
        checkoutUrl: result.data.checkoutUrl,
        qrCode: result.data.qrCode,
        amount: paymentAmount,
        orderCode: orderCode,
        description,
        expiresAt: payment.expiresAt,
        courseTitle: course.title,
      });
    } catch (apiError) {
      console.error("❌ PayOS API call failed:", apiError);

      // Xóa payment nếu tạo link thất bại
      await Payment.findByIdAndDelete(payment._id);

      return res.status(500).json({
        success: false,
        message: "Không thể kết nối với PayOS API",
        error: apiError.message,
      });
    }
  } catch (error) {
    console.error("❌ PayOS createPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tạo thanh toán PayOS",
      error: error.message,
    });
  }
}

/**
 * 🔍 KIỂM TRA TRẠNG THÁI THANH TOÁN PAYOS
 * GET /api/payment/payos/status?orderCode=xxx
 */
export async function checkPayOSPaymentStatus(req, res) {
  try {
    const { orderCode } = req.query;

    if (!orderCode) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp orderCode",
      });
    }

    const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
    const PAYOS_API_KEY = process.env.PAYOS_API_KEY;

    // ✅ Gọi PayOS API để check status
    const response = await fetch(
      `https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`,
      {
        method: "GET",
        headers: {
          "x-client-id": PAYOS_CLIENT_ID,
          "x-api-key": PAYOS_API_KEY,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Không thể kiểm tra trạng thái thanh toán",
        error: result,
      });
    }

    return res.json({
      success: true,
      status: result.data.status,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Check PayOS status error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra trạng thái thanh toán",
      error: error.message,
    });
  }
}

/**
 * ❌ HỦY THANH TOÁN PAYOS
 * POST /api/payment/payos/cancel
 */
export async function cancelPayOSPayment(req, res) {
  try {
    const { orderCode, reason } = req.body;

    if (!orderCode) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp orderCode",
      });
    }

    const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
    const PAYOS_API_KEY = process.env.PAYOS_API_KEY;

    // ✅ Gọi PayOS API để cancel
    const response = await fetch(
      `https://api-merchant.payos.vn/v2/payment-requests/${orderCode}/cancel`,
      {
        method: "POST",
        headers: {
          "x-client-id": PAYOS_CLIENT_ID,
          "x-api-key": PAYOS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancellationReason: reason || "User cancelled",
        }),
      }
    );

    const result = await response.json();

    // ✅ Cập nhật payment trong database
    const payment = await Payment.findOne({
      "paymentDetails.orderCode": orderCode.toString(),
    });

    if (payment) {
      payment.status = "cancelled";
      payment.note = `${payment.note || ""} | Cancelled: ${
        reason || "User cancelled"
      }`;
      await payment.save();
    }

    return res.json({
      success: true,
      message: "Đã hủy thanh toán",
      result: result,
    });
  } catch (error) {
    console.error("❌ Cancel PayOS payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hủy thanh toán",
      error: error.message,
    });
  }
}
