import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./VietQRPayment.css"; // Sử dụng lại CSS

const PayOSPayment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const EXPIRE_MS = 5 * 60 * 1000; // 5 minutes

  // Helpers
  const isJwtExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      if (!payload?.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      // ignore parse error
      return false;
    }
  };

  // Lấy user từ localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
    }
    return null;
  };

  // Fetch course info
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_URL}/courses/${courseId}`);
        const data = await res.json();
        if (data) {
          setCourse(data);
        } else {
          setError("Không tìm thấy khóa học");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("Thiếu thông tin khóa học");
      setLoading(false);
    }
  }, [courseId]);

  // Tạo link thanh toán PayOS
  const handlePayWithPayOS = async () => {
    if (isProcessing) return;

    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }

    // Kiểm tra hết hạn
    if (isJwtExpired(token)) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const user = getUserData();
    const userId = user?._id || user?.id;

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/payment/payos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: course?.price || 100000,
          courseId: course?._id,
          // userId sẽ được lấy từ JWT token ở backend
        }),
      });

      // Nếu 401/403: buộc đăng nhập lại
      if (res.status === 401 || res.status === 403) {
        try {
          const err = await res.json();
          setError(err?.message || "Token không hợp lệ hoặc đã hết hạn!");
        } catch (e) {
          console.warn("parse auth error response:", e);
          setError("Token không hợp lệ hoặc đã hết hạn!");
        }
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        // Lưu thời điểm bắt đầu và chuyển hướng trực tiếp tại tab hiện tại
        setStartedAt(Date.now());
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || "Không thể tạo link thanh toán");
        alert(data.message || "Không thể tạo link thanh toán");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Có lỗi xảy ra khi tạo link thanh toán");
      alert("Có lỗi xảy ra!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-cancel if user quay lại mà hết 5 phút từ lúc tạo link (phòng khi PayOS mở tab mới)
  useEffect(() => {
    if (!startedAt) return;
    setRemainingMs(Math.max(0, EXPIRE_MS - (Date.now() - startedAt)));
    const t = setInterval(() => {
      const diff = Date.now() - startedAt;
      const remain = Math.max(0, EXPIRE_MS - diff);
      setRemainingMs(remain);
      if (diff > EXPIRE_MS) {
        alert(
          "Liên kết thanh toán đã hết hạn sau 5 phút. Đang chuyển về trang hủy."
        );
        navigate(`/payment-cancel?courseId=${courseId}`);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [startedAt, courseId, navigate, EXPIRE_MS]);

  const formatMs = (ms) => {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Hủy và quay lại
  const handleCancel = () => {
    navigate(`/courses/${courseId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="vietqr-payment-page">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !course) {
    return (
      <div className="vietqr-payment-page">
        <div className="container">
          <div className="error-box">
            <i className="fas fa-exclamation-circle"></i>
            <h2>Lỗi</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/courses")} className="btn-back">
              Quay lại danh sách khóa học
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vietqr-payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>
            <i className="fas fa-credit-card"></i> Thanh toán PayOS
          </h1>
          <p>Thanh toán nhanh chóng và an toàn với PayOS</p>
        </div>

        {/* Course Info */}
        <div className="course-info-card">
          <div className="course-info-content">
            <div className="course-icon">
              <i className={course?.icon || "fas fa-graduation-cap"}></i>
            </div>
            <div className="course-details">
              <h2>{course?.title}</h2>
              <div className="course-meta">
                <span>
                  <i className="fas fa-tag"></i> {course?.category}
                </span>
                <span>
                  <i className="fas fa-clock"></i> {course?.duration}
                </span>
                <span>
                  <i className="fas fa-users"></i> {course?.students} học viên
                </span>
              </div>
            </div>
            <div className="course-price">
              <span className="price-label">Giá khóa học</span>
              <span className="price-amount">
                {course?.price?.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="create-qr-section">
          {startedAt && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "12px 16px",
                border: "1px dashed #999",
                borderRadius: 8,
                background: "#fff3cd",
                color: "#8a6d3b",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <i className="fas fa-hourglass-half"></i>
              <div>
                <strong>Liên kết thanh toán sẽ hết hạn sau:</strong>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {formatMs(remainingMs)}
                </div>
                <small>
                  PayOS đã mở ở tab mới. Vui lòng hoàn tất thanh toán trước khi
                  thời gian kết thúc.
                </small>
              </div>
            </div>
          )}
          <div className="payment-info">
            <h3>
              <i className="fas fa-info-circle"></i> Phương thức thanh toán
              PayOS
            </h3>
            <ul>
              <li>✅ Thanh toán qua cổng PayOS - An toàn và bảo mật</li>
              <li>✅ Hỗ trợ: Ví điện tử, thẻ ngân hàng, QR Code</li>
              <li>✅ Tự động nhận khóa học ngay sau khi thanh toán</li>
              <li>✅ Không cần chờ admin xác nhận</li>
              <li>⚡ Xử lý siêu nhanh trong 1-3 giây</li>
            </ul>
          </div>

          <div
            className="payment-info"
            style={{ background: "#e3f2fd", marginTop: "1rem" }}
          >
            <h3 style={{ color: "#1976d2" }}>
              <i className="fas fa-lightbulb"></i> Lưu ý quan trọng
            </h3>
            <ul>
              <li>
                Sau khi bấm nút "Thanh toán", bạn sẽ được chuyển đến trang PayOS
              </li>
              <li>Hoàn tất thanh toán trên trang PayOS</li>
              <li>
                Hệ thống tự động cập nhật và bạn sẽ nhận khóa học ngay lập tức
              </li>
              <li>Không cần quay lại trang này sau khi thanh toán</li>
            </ul>
          </div>

          <button
            onClick={handlePayWithPayOS}
            disabled={isProcessing}
            className="btn-create-qr"
            style={{ marginTop: "2rem" }}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang tạo link thanh
                toán...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card"></i> Thanh toán ngay với PayOS
              </>
            )}
          </button>

          <button onClick={handleCancel} className="btn-cancel">
            <i className="fas fa-times"></i> Hủy bỏ
          </button>

          {error && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#ffebee",
                border: "1px solid #ef5350",
                borderRadius: "8px",
                color: "#c62828",
              }}
            >
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayOSPayment;
