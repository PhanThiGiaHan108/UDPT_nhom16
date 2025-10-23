import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { id: courseId } = useParams(); // Lấy courseId từ URL /pay/:id
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch thông tin khóa học khi component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        );
        console.log("✅ Course fetched:", res.data);
        console.log("💰 Course price:", res.data.price, typeof res.data.price);
        setCourse(res.data);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
        setMessage("Không thể tải thông tin khóa học!");
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const userStr = localStorage.getItem("user");
      console.log("👤 User from localStorage:", userStr);

      if (!userStr) {
        console.log("❌ No user in localStorage, redirecting to login");
        setMessage("Vui lòng đăng nhập để thanh toán!");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const user = JSON.parse(userStr);
      console.log("👤 Parsed user:", user);

      // Hỗ trợ cả _id và id
      const userId = user._id || user.id;

      if (!user || !userId) {
        console.log("❌ Invalid user data, redirecting to login");
        setMessage("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!course) {
        setMessage("Chưa tải xong thông tin khóa học!");
        return;
      }

      // Lấy giá từ database
      const amount = course.price;

      console.log("💳 Payment data:", {
        userId: userId,
        courseId,
        amount,
        amountType: typeof amount,
        course: course,
      });

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-link",
        {
          userId: userId,
          courseId,
          amount,
          description: `${userId}_${courseId}`, // Dễ xử lý khi webhook PayOS gửi về
        }
      );

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl; // ✅ chuyển hướng sang PayOS
      } else {
        setMessage("Không thể tạo liên kết thanh toán.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      setMessage("Lỗi khi tạo thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="payment-page"
      style={{ textAlign: "center", padding: "50px" }}
    >
      <h2>💳 Thanh toán khóa học</h2>

      {!course ? (
        <p>Đang tải thông tin khóa học...</p>
      ) : (
        <>
          <div
            style={{
              maxWidth: "500px",
              margin: "20px auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>{course.title}</h3>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              {course.description}
            </p>
            <p
              style={{ fontSize: "24px", fontWeight: "bold", color: "#7b2ff2" }}
            >
              Số tiền: {(course.price || 0).toLocaleString("vi-VN")}đ
            </p>
          </div>

          <button
            onClick={handlePayment}
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: "12px 30px",
              marginTop: "20px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#7b2ff2",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang tạo liên kết..." : "Thanh toán qua PayOS"}
          </button>
        </>
      )}

      {message && <p style={{ color: "red", marginTop: "15px" }}>{message}</p>}
    </div>
  );
};

export default PaymentPage;
