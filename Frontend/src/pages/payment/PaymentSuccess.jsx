import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/my-courses"), 3000);
  }, [navigate]);

  return (
    <div
      className="payment-success"
      style={{ textAlign: "center", padding: "80px" }}
    >
      <h2>🎉 Thanh toán thành công!</h2>
      <p>Bạn đã ghi danh vào khóa học thành công.</p>
      <p>Chuyển hướng về trang "Khóa học của tôi" sau vài giây...</p>
    </div>
  );
};

export default PaymentSuccess;
