import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/${id}`);
      if (!res.ok) throw new Error("Không tìm thấy khóa học");
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để đăng ký khóa học!");
        navigate("/login");
        return;
      }

      // Kiểm tra giá khóa học
      const coursePrice = Number(course.price) || 0;

      // Nếu khóa học miễn phí, đăng ký trực tiếp
      if (coursePrice === 0) {
        setEnrolling(true);
        const res = await fetch(`${API_URL}/enrollments/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Đăng ký thất bại");
        }

        alert("🎉 Đăng ký khóa học miễn phí thành công!");
        navigate("/my-courses");
        return;
      }

      // Nếu khóa học có phí, chuyển sang trang thanh toán PayOS
      navigate(`/payos-payment/${id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <div
            className="loading"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <i
              className="fas fa-spinner fa-spin"
              style={{ fontSize: "3rem", color: "var(--primary)" }}
            ></i>
            <p>Đang tải thông tin khóa học...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i>{" "}
            {error || "Không tìm thấy khóa học"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            className="admin-title"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            <i className="fas fa-shopping-cart"></i> Đăng ký khóa học
          </h1>

          <div className="course-form" style={{ marginBottom: "2rem" }}>
            <h2
              style={{ color: "var(--primary-darker)", marginBottom: "1rem" }}
            >
              {course.title}
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <span
                className="badge"
                style={{
                  background: "var(--badge-bg)",
                  color: "var(--primary-darker)",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                }}
              >
                {course.category}
              </span>
            </div>

            <p
              style={{
                color: "var(--text)",
                marginBottom: "1.5rem",
                lineHeight: "1.6",
              }}
            >
              {course.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  background: "#f8f9fb",
                  borderRadius: "8px",
                }}
              >
                <i
                  className="fas fa-clock"
                  style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                ></i>
                <strong>Thời lượng:</strong>{" "}
                {course.duration || "Chưa cập nhật"}
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: "#f8f9fb",
                  borderRadius: "8px",
                }}
              >
                <i
                  className="fas fa-users"
                  style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                ></i>
                <strong>Học viên:</strong> {course.students || 0}
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: "#f8f9fb",
                  borderRadius: "8px",
                }}
              >
                <i
                  className="fas fa-star"
                  style={{ color: "#ffa500", marginRight: "0.5rem" }}
                ></i>
                <strong>Đánh giá:</strong> {course.rating || 0}/5
              </div>
              {course.instructor && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f8f9fb",
                    borderRadius: "8px",
                  }}
                >
                  <i
                    className="fas fa-chalkboard-teacher"
                    style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                  ></i>
                  <strong>Giảng viên:</strong> {course.instructor}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                color: "white",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                      opacity: 0.9,
                    }}
                  >
                    Giá khóa học
                  </p>
                  <h2
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {course.price
                      ? Number(course.price).toLocaleString("vi-VN") + "đ"
                      : "Miễn phí"}
                  </h2>
                </div>
                <i
                  className="fas fa-tag"
                  style={{ fontSize: "3rem", opacity: 0.3 }}
                ></i>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "1.2rem", fontSize: "1.1rem" }}
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                </>
              ) : (
                <>
                  {Number(course.price) > 0 ? (
                    <>
                      <i className="fas fa-credit-card"></i> Thanh toán & Đăng
                      ký
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i> Đăng ký miễn phí
                    </>
                  )}
                </>
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginTop: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <i className="fas fa-info-circle"></i> Bạn sẽ có quyền truy cập
              vĩnh viễn sau khi đăng ký
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
