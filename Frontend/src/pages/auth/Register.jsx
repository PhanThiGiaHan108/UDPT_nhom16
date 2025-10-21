import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này
import { motion } from "framer-motion";

import "./auth.css";

const Register = () => {
  const navigate = useNavigate(); // ✅ Hook để điều hướng
  const cardVariant = {
    hidden: { x: -40, opacity: 0 },
    enter: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.2, 0.9, 0.2, 1] },
    },
    exit: { x: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") checkPasswordStrength(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage({
        type: "success",
        text: "🎉 Đăng ký thành công! Đang chuyển hướng...",
      });
      console.log("Register success:", res.data);

      // ✅ Chuyển sang trang đăng nhập sau 1 giây
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "❌ Đăng ký thất bại!",
      });
    }
  };

  return (
    <div className="register-page">
      <section className="register-main">
        <div className="register-container">
          <div className="register-form-wrapper">
            <motion.div
              className="register-form-card auth-card"
              variants={cardVariant}
              initial="hidden"
              animate="enter"
              exit="exit"
            >
              <h2>Đăng ký tài khoản</h2>

              {message.text && (
                <div
                  className={`alert ${
                    message.type === "error" ? "alert-error" : "alert-success"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="register-form"
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="name">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password icon-btn"
                      onClick={togglePassword}
                      aria-label="Hiện/Ẩn mật khẩu"
                    >
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>

                  {passwordStrength && (
                    <div className="password-strength">
                      <div
                        className={`strength-bar strength-${passwordStrength}`}
                      >
                        <div className="strength-fill"></div>
                      </div>
                      <span
                        className={`strength-text strength-${passwordStrength}`}
                      >
                        {passwordStrength === "weak" && "Yếu"}
                        {passwordStrength === "medium" && "Trung bình"}
                        {passwordStrength === "strong" && "Mạnh"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      placeholder="Nhập lại mật khẩu"
                      required
                      value={formData.password_confirmation}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password confirm icon-btn"
                      onClick={toggleConfirmPassword}
                      aria-label="Hiện/Ẩn mật khẩu"
                    >
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-group terms-group">
                  <label className="terms-checkbox">
                    <input type="checkbox" name="terms" required />
                    <span>
                      Tôi đồng ý với{" "}
                      <a href="/terms" target="_blank" rel="noreferrer">
                        Điều khoản dịch vụ
                      </a>{" "}
                      và{" "}
                      <a href="/privacy" target="_blank" rel="noreferrer">
                        Chính sách bảo mật
                      </a>
                    </span>
                  </label>
                </div>

                <button className="btn btn-register-submit" type="submit">
                  <i className="fas fa-user-plus"></i> Tạo tài khoản
                </button>
              </form>

              <div className="register-footer">
                <p>
                  Đã có tài khoản?{" "}
                  <a href="/login" className="login-link">
                    Đăng nhập ngay
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
