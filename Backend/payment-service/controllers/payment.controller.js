import crypto from "crypto";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const k of keys) sorted[k] = obj[k];
  return sorted;
}

// ==================== VNPAY FUNCTIONS ====================

export async function createPaymentUrl(req, res) {
  try {
    const {
      amount = 0,
      orderDescription = "Thanh toán đơn hàng",
      courseId,
      bankCode,
      locale = "vn",
    } = req.body || {};

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE || "";
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET || "";
    const vnp_Url =
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl =
      process.env.VNPAY_RETURN_URL || "http://localhost:3000/payment-result";

    // Fallback mock URL if not configured
    if (!vnp_TmnCode || !vnp_HashSecret) {
      const mockUrl =
        process.env.MOCK_PAYMENT_URL ||
        "https://sandbox.vnpayment.vn/tryitnow/";
      return res.json({
        paymentUrl: mockUrl,
        note: "Using MOCK payment URL because VNPay credentials are not configured.",
      });
    }

    const date = new Date();
    const pad = (n) => (n < 10 ? "0" + n : String(n));
    const createDate =
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds());

    const vnp_TxnRef = `${Date.now()}`; // unique order id
    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.ip ||
      "127.0.0.1";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl,
      vnp_IpAddr: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
    if (courseId) {
      vnp_Params[
        "vnp_OrderInfo"
      ] = `${orderDescription} | CourseID=${courseId}`;
    }

    // Sort params and sign
    vnp_Params = sortObject(vnp_Params);
    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const secureHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${secureHash}`;

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("VNPay createPaymentUrl error:", error);
    return res
      .status(500)
      .json({ message: "Cannot create payment URL", error: error.message });
  }
}

// ==================== VIETQR FUNCTIONS ====================

/**
 * 🎯 TẠO MÃ QR VIETQR
 * POST /api/payment/vietqr/create
 */
export async function createVietQRPayment(req, res) {
  try {
    const { amount, courseId, userId } = req.body;

    // ✅ Validate input
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId và userId là bắt buộc",
      });
    }

    // ✅ Kiểm tra course tồn tại
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    // ✅ Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // ✅ Kiểm tra đã đăng ký khóa học chưa
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký khóa học này rồi",
      });
    }

    // ✅ Kiểm tra có payment pending không
    const existingPayment = await Payment.findOne({
      userId,
      courseId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (existingPayment) {
      // Trả về payment cũ nếu còn hạn
      return res.json({
        success: true,
        paymentId: existingPayment._id,
        transactionId: existingPayment.transactionId,
        qrCodeUrl: existingPayment.paymentDetails.qrCodeUrl,
        amount: existingPayment.amount,
        bankInfo: {
          bankId: existingPayment.paymentDetails.bankCode,
          accountNo: existingPayment.paymentDetails.bankAccount,
          accountName: process.env.VIETQR_ACCOUNT_NAME || "EDULEARN",
        },
        description: existingPayment.note,
        expiresAt: existingPayment.expiresAt,
        courseTitle: course.title,
      });
    }

    // ✅ Lấy thông tin ngân hàng từ env
    const bankId = process.env.VIETQR_BANK_ID || "BIDV";
    const accountNo = process.env.VIETQR_ACCOUNT_NO || "4661397959";
    const accountName = process.env.VIETQR_ACCOUNT_NAME || "EDULEARN";
    const template = process.env.VIETQR_TEMPLATE || "qr_only";

    // ✅ Tạo transaction ID duy nhất
    const transactionId = `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const paymentAmount = amount || course.price;

    // ✅ Tạo nội dung chuyển khoản (Quan trọng!)
    const description = `${transactionId} ${course.title}`;

    // ✅ Tạo URL VietQR
    const vietqrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.jpg?amount=${paymentAmount}&addInfo=${encodeURIComponent(
      description
    )}&accountName=${encodeURIComponent(accountName)}`;

    // ✅ Lưu payment vào database
    const payment = new Payment({
      userId,
      courseId,
      amount: paymentAmount,
      paymentMethod: "vietqr",
      status: "pending",
      transactionId,
      paymentDetails: {
        bankCode: bankId,
        bankAccount: accountNo,
        qrCodeUrl: vietqrUrl,
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Hết hạn sau 15 phút
      note: description,
    });

    await payment.save();

    // ✅ Trả về thông tin cho Frontend
    return res.json({
      success: true,
      paymentId: payment._id,
      transactionId,
      qrCodeUrl: vietqrUrl,
      amount: paymentAmount,
      bankInfo: {
        bankId,
        accountNo,
        accountName,
      },
      description,
      expiresAt: payment.expiresAt,
      courseTitle: course.title,
    });
  } catch (error) {
    console.error("❌ VietQR createPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tạo mã thanh toán VietQR",
      error: error.message,
    });
  }
}

/**
 * ✅ XÁC NHẬN THANH TOÁN (CHỈ CHO ADMIN)
 * POST /api/payment/vietqr/confirm
 *
 * ⚠️ BẢO MẬT: API này CHỈ dành cho ADMIN xác nhận thủ công
 * USER KHÔNG THỂ tự xác nhận thanh toán
 */
export async function confirmPayment(req, res) {
  try {
    const { transactionId, paymentId } = req.body;

    // 🔒 KIỂM TRA QUYỀN ADMIN
    // ⚠️ CHỈ ADMIN mới có thể xác nhận thanh toán thủ công
    const user = req.user; // Từ middleware authenticateToken

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "❌ TRUY CẬP BỊ TỪ CHỐI: Chỉ admin mới có thể xác nhận thanh toán thủ công. Vui lòng sử dụng PayOS để thanh toán tự động.",
        requireAdmin: true,
      });
    }

    if (!transactionId && !paymentId) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp transactionId hoặc paymentId",
      });
    }

    // Tìm payment
    const query = transactionId ? { transactionId } : { _id: paymentId };
    const payment = await Payment.findOne(query)
      .populate("courseId")
      .populate("userId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch",
      });
    }

    // Kiểm tra đã hết hạn chưa
    if (payment.expiresAt && new Date() > payment.expiresAt) {
      payment.status = "cancelled";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Giao dịch đã hết hạn",
        payment,
      });
    }

    // Kiểm tra đã thanh toán chưa
    if (payment.status === "success") {
      return res.json({
        success: true,
        message: "Giao dịch đã được xác nhận trước đó",
        payment,
      });
    }

    // Cập nhật trạng thái
    payment.status = "success";
    payment.paidAt = new Date();
    payment.note = `${payment.note || ""} | Admin manual confirm: ${
      user.email
    }`;
    await payment.save();

    // 🎯 Tạo enrollment cho user
    try {
      const enrollment = new Enrollment({
        userId: payment.userId._id,
        courseId: payment.courseId._id,
      });
      await enrollment.save();

      // Cập nhật số học viên
      await Course.findByIdAndUpdate(payment.courseId._id, {
        $inc: { students: 1 },
      });
    } catch (enrollmentError) {
      console.error("❌ Enrollment error:", enrollmentError);
      // Không return error, vì payment đã thành công
    }

    return res.json({
      success: true,
      message:
        "✅ Admin đã xác nhận thanh toán thành công! User đã được đăng ký vào khóa học.",
      payment,
    });
  } catch (error) {
    console.error("❌ confirmPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác nhận thanh toán",
      error: error.message,
    });
  }
}

/**
 * 🔍 KIỂM TRA TRẠNG THÁI THANH TOÁN
 * GET /api/payment/vietqr/status?paymentId=xxx
 */
export async function checkPaymentStatus(req, res) {
  try {
    const { paymentId, transactionId } = req.query;

    if (!paymentId && !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp paymentId hoặc transactionId",
      });
    }

    const query = transactionId ? { transactionId } : { _id: paymentId };
    const payment = await Payment.findOne(query)
      .populate("courseId", "title price category")
      .populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch",
      });
    }

    return res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("❌ checkPaymentStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra trạng thái thanh toán",
      error: error.message,
    });
  }
}

/**
 * 📜 LẤY LỊCH SỬ THANH TOÁN
 * GET /api/payment/user/:userId
 */
export async function getUserPayments(req, res) {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId })
      .populate("courseId", "title price category")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("❌ getUserPayments error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy lịch sử thanh toán",
      error: error.message,
    });
  }
}

/**
 * ❌ HỦY THANH TOÁN
 * POST /api/payment/vietqr/cancel
 */
export async function cancelPayment(req, res) {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Cần cung cấp paymentId",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch",
      });
    }

    if (payment.status === "success") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy giao dịch đã thanh toán",
      });
    }

    payment.status = "cancelled";
    await payment.save();

    return res.json({
      success: true,
      message: "Đã hủy giao dịch",
      payment,
    });
  } catch (error) {
    console.error("❌ cancelPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hủy thanh toán",
      error: error.message,
    });
  }
}
