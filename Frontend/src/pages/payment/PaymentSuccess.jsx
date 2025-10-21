import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./VietQRPayment.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    // Countdown và tự động chuyển trang
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/my-courses");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="vietqr-payment-page">
      <div className="container">
        <div className="create-qr-section" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "5rem",
              color: "#27ae60",
              marginBottom: "1rem",
            }}
          >
            <i className="fas fa-check-circle"></i>
          </div>

          <h1 style={{ color: "#27ae60", marginBottom: "1rem" }}>
            🎉 Thanh toán thành công!
          </h1>

          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            Bạn đã được đăng ký vào khóa học thành công!
          </p>

          <div
            className="payment-info"
            style={{ background: "#d4edda", textAlign: "left" }}
          >
            <h3 style={{ color: "#155724" }}>
              <i className="fas fa-info-circle"></i> Thông tin
            </h3>
            <ul>
              <li>✅ Thanh toán đã được xử lý thành công</li>
              <li>✅ Khóa học đã được thêm vào tài khoản của bạn</li>
              <li>✅ Bạn có thể bắt đầu học ngay bây giờ</li>
            </ul>
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "#fff3cd",
              borderRadius: "10px",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem" }}>
              <i className="fas fa-clock"></i> Tự động chuyển đến "Khóa học của
              tôi" sau <strong>{countdown}</strong> giây...
            </p>
          </div>

          <button
            onClick={() => navigate("/my-courses")}
            className="btn-create-qr"
            style={{ marginTop: "2rem" }}
          >
            <i className="fas fa-book"></i> Đi đến Khóa học của tôi ngay
          </button>

          <button
            onClick={() => navigate("/courses")}
            className="btn-cancel"
            style={{ marginTop: "1rem" }}
          >
            <i className="fas fa-list"></i> Xem thêm khóa học khác
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
