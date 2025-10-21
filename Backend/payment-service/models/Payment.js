import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["vietqr", "vnpay", "momo", "cash", "payos"],
      default: "payos",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    paymentDetails: {
      bankCode: String,
      bankAccount: String,
      qrCodeUrl: String,
    },
    paidAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    note: String,
    // Thông tin từ Casso
    cassoTransactionId: {
      type: String,
      unique: true,
      sparse: true, // Allow null
    },
    bankTransactionId: String, // TID từ ngân hàng
    paidAmount: {
      type: Number,
      default: 0,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để query nhanh
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
