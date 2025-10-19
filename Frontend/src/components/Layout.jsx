import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // ✅ THÊM DÒNG NÀY

const Layout = () => {
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 🔹 Hàm đọc user từ localStorage
  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleUserLogin = () => loadUser();
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>EduLearn</span>
          </div>

          <ul className="nav-links">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/courses">Khóa học</a>
            </li>
            <li>
              <a href="/features">Tính năng</a>
            </li>
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>

          <div className="auth-buttons">
            {user ? (
              <div className={`user-menu ${userMenuOpen ? "open" : ""}`}>
                <button
                  className="user-btn"
                  onClick={toggleUserMenu}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                >
                  {user.name} <i className="fas fa-chevron-down"></i>
                </button>
                <div className="user-dropdown">
                  <a href="/profile">Hồ sơ</a>
                  <a href="/my-courses">Khóa học của tôi</a>
                  <a href="/settings">Cài đặt</a>
                  {user.role === "admin" && <a href="/admin">Quản trị</a>}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="logout-btn"
                  >
                    Đăng xuất
                  </a>
                </div>
              </div>
            ) : (
              <>
                <a href="/login" className="btn btn-outline">
                  Đăng nhập
                </a>
                <a href="/register" className="btn btn-primary">
                  Đăng ký
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ✅ Nội dung các trang sẽ hiển thị tại đây */}
      <main className="main-wrapper" style={{ minHeight: "70vh" }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EduLearn</h3>
            <p>Nền tảng học trực tuyến hàng đầu Việt Nam</p>
          </div>
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <p>Email: support@edulearn.vn</p>
            <p>Hotline: 1900-xxxx</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EduLearn. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
