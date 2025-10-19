import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({ name: parsedUser.name, email: parsedUser.email });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: formData.name, email: formData.email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event("storage"));
    setMessage("Cập nhật thành công!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePasswordDataChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    // TODO: Call API to change password
    alert("Đổi mật khẩu thành công! (Tính năng đang phát triển)");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (!user)
    return (
      <div>
        <p>Đang tải...</p>
      </div>
    );

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "3rem 0",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "2.5rem",
              margin: "0 0 0.5rem 0",
              fontWeight: "700",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <i className="fas fa-cog" style={{ animation: "none" }}></i>
            Cài đặt tài khoản
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              margin: 0,
            }}
          >
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div
            style={{
              background: "white",
              color: "#27ae60",
              padding: "1.25rem 1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              textAlign: "center",
              fontWeight: "600",
              border: "2px solid #27ae60",
              boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            <i
              className="fas fa-check-circle"
              style={{ fontSize: "1.5rem" }}
            ></i>
            {message}
          </div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              color: "#2d3748",
              marginBottom: "1.5rem",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "0.5rem",
            }}
          >
            Thông tin cá nhân
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Họ và tên:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                💾 Lưu thay đổi
              </button>
              <a
                href="/profile"
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textDecoration: "none",
                  background: "#e2e8f0",
                  color: "#4a5568",
                  display: "inline-block",
                }}
              >
                ❌ Hủy
              </a>
            </div>
          </form>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#2d3748",
              marginBottom: "1.5rem",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "0.5rem",
            }}
          >
            Đổi mật khẩu
          </h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "0.5rem",
              }}
            >
              Mật khẩu hiện tại:
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "0.5rem",
              }}
            >
              Mật khẩu mới:
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "0.5rem",
              }}
            >
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <button
            type="button"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: "#e74c3c",
              color: "white",
            }}
          >
            🔒 Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
