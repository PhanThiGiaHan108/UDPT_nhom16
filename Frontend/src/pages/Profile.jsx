import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Đọc thông tin user từ localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      // Nếu chưa đăng nhập, chuyển về trang login
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return (
      <section className="profile-page">
        <div className="container">
          <p>Đang tải thông tin...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="container">
        {/* Header Banner */}
        <div className="profile-banner">
          <div className="profile-banner-overlay">
            <h1>Hồ Sơ Cá Nhân</h1>
          </div>
        </div>

        <div className="profile-content">
          {/* Left Sidebar - Avatar & Quick Info */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar-wrapper">
                <img
                  src={
                    user.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.name) +
                      "&size=200&background=4A90E2&color=fff"
                  }
                  alt="Avatar"
                  className="profile-avatar"
                />
                <button
                  className="avatar-edit-btn"
                  title="Thay đổi ảnh đại diện"
                >
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-role">
                <i className="fas fa-user"></i> Học viên
              </p>
              <div className="profile-stats">
                <div className="stat-item">
                  <i className="fas fa-book"></i>
                  <span className="stat-number">12</span>
                  <span className="stat-label">Khóa học</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-certificate"></i>
                  <span className="stat-number">5</span>
                  <span className="stat-label">Chứng chỉ</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Đánh giá</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="profile-card profile-actions">
              <h3>
                <i className="fas fa-bolt"></i> Thao tác nhanh
              </h3>
              <a href="/my-courses" className="action-btn">
                <i className="fas fa-graduation-cap"></i>
                <span>Khóa học của tôi</span>
              </a>
              <a href="/settings" className="action-btn">
                <i className="fas fa-cog"></i>
                <span>Cài đặt tài khoản</span>
              </a>
              <a href="/certificates" className="action-btn">
                <i className="fas fa-award"></i>
                <span>Chứng chỉ của tôi</span>
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            {/* Personal Information */}
            <div className="profile-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-user-circle"></i> Thông tin cá nhân
                </h3>
                <a href="/settings" className="btn-edit">
                  <i className="fas fa-edit"></i> Chỉnh sửa
                </a>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>
                    <i className="fas fa-signature"></i> Họ và tên
                  </label>
                  <p>{user.name}</p>
                </div>
                <div className="info-item">
                  <label>
                    <i className="fas fa-envelope"></i> Email
                  </label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>
                    <i className="fas fa-id-card"></i> ID Người dùng
                  </label>
                  <p>{user.id}</p>
                </div>
                <div className="info-item">
                  <label>
                    <i className="fas fa-calendar-alt"></i> Ngày tham gia
                  </label>
                  <p>{new Date().toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="profile-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-chart-line"></i> Tiến độ học tập
                </h3>
              </div>
              <div className="progress-section">
                <div className="progress-item">
                  <div className="progress-header">
                    <span>Tỷ lệ hoàn thành khóa học</span>
                    <span className="progress-percent">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span>Giờ học trong tuần</span>
                    <span className="progress-percent">12/20 giờ</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span>Bài tập đã hoàn thành</span>
                    <span className="progress-percent">28/35</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="profile-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-history"></i> Hoạt động gần đây
                </h3>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      Hoàn thành bài học "React Hooks"
                    </p>
                    <p className="activity-time">2 giờ trước</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      Nhận chứng chỉ "JavaScript Cơ bản"
                    </p>
                    <p className="activity-time">1 ngày trước</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-comment"></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      Bình luận trong khóa "Node.js Advanced"
                    </p>
                    <p className="activity-time">3 ngày trước</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          background: #f5f7fa;
          min-height: 100vh;
          padding: 2rem 0;
        }

        .profile-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 200px;
          border-radius: 15px;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .profile-banner-overlay {
          background: rgba(0, 0, 0, 0.2);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-banner h1 {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .profile-content {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
        }

        @media (max-width: 968px) {
          .profile-content {
            grid-template-columns: 1fr;
          }
        }

        .profile-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .profile-avatar-wrapper {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 1.5rem;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .avatar-edit-btn:hover {
          background: #5568d3;
          transform: scale(1.1);
        }

        .profile-name {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .profile-role {
          text-align: center;
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item i {
          font-size: 1.5rem;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: #718096;
        }

        .profile-actions h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 10px;
          background: #f7fafc;
          color: #2d3748;
          text-decoration: none;
          transition: all 0.3s;
          margin-bottom: 0.75rem;
        }

        .action-btn:hover {
          background: #667eea;
          color: white;
          transform: translateX(5px);
        }

        .action-btn i {
          font-size: 1.2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .card-header h3 {
          font-size: 1.3rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-edit {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: #667eea;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-edit:hover {
          background: #5568d3;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        .info-item label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .info-item p {
          color: #2d3748;
          font-size: 1rem;
          padding-left: 1.5rem;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .progress-item {
          width: 100%;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
        }

        .progress-percent {
          color: #667eea;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .activity-item:hover {
          background: #edf2f7;
          transform: translateX(5px);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.875rem;
          color: #718096;
        }
      `}</style>
    </section>
  );
};

export default Profile;
