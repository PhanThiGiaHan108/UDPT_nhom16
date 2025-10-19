import { useParams } from "react-router-dom";

const PaymentPage = () => {
  const { id } = useParams();
  // TODO: Fetch course từ API bằng id
  const course = null;

  // TODO: Tích hợp thanh toán PayOs tại đây

  if (!course) {
    return (
      <div className="payment-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>Không tìm thấy khóa học!</p>
      </div>
    );
  }

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-header">
            <h1>Thanh toán khóa học</h1>
            <p className="muted">Hoàn tất thanh toán để bắt đầu học ngay</p>
          </div>

          {/* Thông tin khoá học */}
          <div className="payment-card">
            <div className="course-summary">
              <div className="course-summary-icon">
                <i className={course.icon || "fas fa-book"}></i>
              </div>
              <div className="course-summary-details">
                <h2>{course.title}</h2>
                <div className="course-summary-meta">
                  <span>
                    <i className="fas fa-clock"></i> {course.duration}
                  </span>
                  <span>
                    <i className="fas fa-users"></i> {course.students} học viên
                  </span>
                  <span>
                    <i className="fas fa-star"></i> {course.rating}/5
                  </span>
                </div>
                {course.description && (
                  <p className="course-summary-desc">{course.description}</p>
                )}
              </div>
            </div>

            <div className="payment-divider"></div>

            <div className="payment-details">
              <div className="payment-row">
                <span>Giá khóa học:</span>
                <strong>{course.price?.toLocaleString("vi-VN")}đ</strong>
              </div>
              <div className="payment-row">
                <span>Phí xử lý:</span>
                <strong>0đ</strong>
              </div>
              <div className="payment-divider"></div>
              <div className="payment-row payment-total">
                <span>Tổng cộng:</span>
                <strong className="total-price">
                  {course.price?.toLocaleString("vi-VN")}đ
                </strong>
              </div>
            </div>

            {/* TODO: Tích hợp nút và giao diện thanh toán PayOs tại đây */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
