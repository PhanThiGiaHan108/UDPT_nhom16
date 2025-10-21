import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";
import "./admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCoursePrice: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Lấy thống kê users
      const usersRes = await api.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Lấy thống kê courses
      const coursesRes = await api.get("/api/courses");
      
      const courses = coursesRes.data.data || [];
      const totalCoursePrice = courses.reduce((sum, c) => sum + (c.price || 0), 0);
      const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
      
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalCourses: courses.length,
        totalCoursePrice,
        totalStudents,
      });
    } catch (err) {
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-container">
          <p className="loading">Đang tải...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <h1 className="admin-title">Bảng điều khiển</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ background: "#4299e1" }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="dashboard-card-content">
            <h3>Người dùng</h3>
            <p className="dashboard-number">{stats.totalUsers}</p>
            <Link to="/admin/users" className="dashboard-link">
              Xem chi tiết →
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ background: "#48bb78" }}>
            <i className="fas fa-book"></i>
          </div>
          <div className="dashboard-card-content">
            <h3>Khóa học</h3>
            <p className="dashboard-number">{stats.totalCourses}</p>
            <Link to="/admin/courses" className="dashboard-link">
              Xem chi tiết →
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ background: "#ed8936" }}>
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="dashboard-card-content">
            <h3>Tổng học viên</h3>
            <p className="dashboard-number">{stats.totalStudents}</p>
            <p className="dashboard-desc">Đã đăng ký khóa học</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ background: "#9f7aea" }}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="dashboard-card-content">
            <h3>Tổng giá trị</h3>
            <p className="dashboard-number" style={{ fontSize: "1.5rem" }}>
              {(stats.totalCoursePrice / 1000000).toFixed(1)}M đ
            </p>
            <p className="dashboard-desc">Tất cả khóa học</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <div className="admin-form" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Hành động nhanh</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/admin/courses" className="btn-primary">
              <i className="fas fa-plus"></i> Thêm khóa học mới
            </Link>
            <Link to="/admin/users" className="btn-primary" style={{ background: "#48bb78" }}>
              <i className="fas fa-users"></i> Quản lý người dùng
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;
