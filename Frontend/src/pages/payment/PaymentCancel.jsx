import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./VietQRPayment.css";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");

  return (
    <div className="vietqr-payment-page">
      <div className="container">
        <div className="create-qr-section" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "5rem",
              color: "#e74c3c",
              marginBottom: "1rem",
            }}
          >
            <i className="fas fa-times-circle"></i>
          </div>

          <h1 style={{ color: "#e74c3c", marginBottom: "1rem" }}>
            Thanh toán đã bị hủy
          </h1>

          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            Giao dịch thanh toán của bạn đã bị hủy hoặc không thành công.
          </p>

          <div
            className="payment-info"
            style={{ background: "#f8d7da", textAlign: "left" }}
          >
            <h3 style={{ color: "#721c24" }}>
              <i className="fas fa-info-circle"></i> Thông tin
            </h3>
            <ul>
              <li>❌ Thanh toán chưa được hoàn tất</li>
              <li>💳 Không có khoản tiền nào bị trừ từ tài khoản của bạn</li>
              <li>🔄 Bạn có thể thử lại bất cứ lúc nào</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="btn-create-qr"
            style={{ marginTop: "2rem" }}
          >
            <i className="fas fa-redo"></i> Thử lại thanh toán
          </button>

          <button
            onClick={() => navigate("/")}
            className="btn-cancel"
            style={{ marginTop: "1rem" }}
          >
            <i className="fas fa-home"></i> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
