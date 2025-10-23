import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div
      className="payment-cancel"
      style={{ textAlign: "center", padding: "80px" }}
    >
      <h2>❌ Thanh toán bị hủy</h2>
      <p>Bạn đã hủy giao dịch hoặc gặp lỗi trong quá trình thanh toán.</p>
      <button
        onClick={() => navigate("/courses")}
        className="btn btn-primary"
        style={{ marginTop: "20px", padding: "10px 25px" }}
      >
        Quay lại khóa học
      </button>
    </div>
  );
};

export default PaymentCancel;
