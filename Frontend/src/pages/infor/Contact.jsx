import React, { useState } from "react";

const Contact = ({ csrfToken = "", flashError = "", flashSuccess = "" }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: call backend API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Main Content */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
              <p className="contact-info-desc">
                Bạn có thể liên hệ với chúng tôi qua các kênh sau hoặc điền form
                bên cạnh.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-info-text">
                    <h4>Địa chỉ</h4>
                    <p>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-info-text">
                    <h4>Điện thoại</h4>
                    <p>1900-xxxx (8:00 - 22:00)</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-info-text">
                    <h4>Email</h4>
                    <p>support@edulearn.vn</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-info-text">
                    <h4>Giờ làm việc</h4>
                    <p>Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h4>Kết nối với chúng tôi</h4>
                <div className="contact-social-links">
                  <a href="#" className="contact-social-link">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="contact-social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="contact-social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="contact-social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="contact-social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="contact-form-card">
                <h3>Gửi tin nhắn cho chúng tôi</h3>
                {flashError && (
                  <div className="alert alert-error">{flashError}</div>
                )}
                {flashSuccess && (
                  <div className="alert alert-success">{flashSuccess}</div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <input type="hidden" name="_csrf" value={csrfToken} />

                  <div className="form-group">
                    <label htmlFor="name">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Nhập họ và tên..."
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Nhập email của bạn..."
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Tin nhắn <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn..."
                      required
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-contact-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
