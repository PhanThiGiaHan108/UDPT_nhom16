import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userLogout"));
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <i className="fas fa-shield-alt"></i>
          <span>Admin Panel</span>
        </div>

        <ul className="admin-navbar-menu">
          <li>
            <Link to="/admin" className={isActive("/admin")}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Bảng điều khiển</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/courses" className={isActive("/admin/courses")}>
              <i className="fas fa-book"></i>
              <span>Khóa học</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={isActive("/admin/users")}>
              <i className="fas fa-users"></i>
              <span>Học viên</span>
            </Link>
          </li>
        </ul>

        <div className="admin-navbar-right">
          <Link to="/" className="admin-nav-link">
            <i className="fas fa-home"></i>
            <span>Trang chủ</span>
          </Link>
          
          <div className="admin-user-info">
            <i className="fas fa-user-circle"></i>
            <span>{user?.name || "Admin"}</span>
          </div>

          <button onClick={handleLogout} className="admin-logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
