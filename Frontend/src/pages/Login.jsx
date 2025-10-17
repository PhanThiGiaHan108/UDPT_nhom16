import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Thêm dòng này

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate(); // 👈 Dùng để chuyển trang

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      // Gửi request đến backend
      const res = await axios.post("/api/auth/login", formData);

      // ✅ Nếu thành công
      setMessage({ type: "success", text: "Đăng nhập thành công!" });
      console.log("Login success:", res.data);

      // Lưu token vào localStorage
      // ✅ Lưu token & user vào localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔔 Báo cho Layout biết user vừa đăng nhập để cập nhật menu ngay
      window.dispatchEvent(new Event("userLogin"));

      // ✅ Điều hướng: chỉ admin@gmail.com với role admin → /admin, others → /home
      setTimeout(() => {
        const user = res.data.user;
        if (user?.role === "admin" && user?.email === "admin@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Đăng nhập thất bại!",
      });
    }
  };

  return (
    <div className="login-page">
      <section className="login-main">
        <div className="login-container">
          <div className="login-form-wrapper">
            <div className="login-form-card">
              <div className="login-form-header">
                <h2>Đăng nhập</h2>
                <p>Nhập thông tin tài khoản của bạn</p>
              </div>

              {message.text && (
                <div
                  className={`alert ${
                    message.type === "error" ? "alert-error" : "alert-success"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i> Mật khẩu
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      aria-label="Hiện/Ẩn mật khẩu"
                      onClick={togglePassword}
                    >
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" name="remember" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="/forgot-password" className="forgot-link">
                    Quên mật khẩu?
                  </a>
                </div>

                <button className="btn btn-primary btn-login" type="submit">
                  <i className="fas fa-sign-in-alt"></i> Đăng nhập
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Chưa có tài khoản?{" "}
                  <a href="/register" className="register-link">
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
