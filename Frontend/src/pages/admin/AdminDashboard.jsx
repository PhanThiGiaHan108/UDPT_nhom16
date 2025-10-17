import React from "react";

const AdminDashboard = ({
  totalUsers = 0,
  totalCourses = 0,
  totalCoursePrice = 0,
  revenueByStudents = 0,
}) => (
  <section className="page-section">
    <div className="container">
      <h1 className="admin-title">Bảng điều khiển</h1>
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">Bảng điều khiển</div>
          <div className="admin-card-body">
            <div className="admin-metric">Trở về trang tổng quan quản trị</div>
            <a className="btn btn-primary" href="/admin">
              Về Dashboard
            </a>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">Người dùng</div>
          <div className="admin-card-body">
            <div className="admin-metric">
              Tổng số: <strong>{totalUsers || "—"}</strong>
            </div>
            <a className="btn btn-primary" href="/admin/users">
              Quản lý người dùng
            </a>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">Khóa học</div>
          <div className="admin-card-body">
            <div className="admin-metric">
              Tổng số: <strong>{totalCourses || "—"}</strong>
            </div>
            <a className="btn btn-primary" href="/admin/courses">
              Quản lý khóa học
            </a>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">Học phí</div>
          <div className="admin-card-body">
            <div className="admin-metric">
              Tổng giá tất cả khóa học:{" "}
              <strong>
                {totalCoursePrice
                  ? totalCoursePrice.toLocaleString("vi-VN") + " đ"
                  : "—"}
              </strong>
            </div>
            <div className="admin-metric">
              Ước tính doanh thu (giá × số học viên):{" "}
              <strong>
                {revenueByStudents
                  ? revenueByStudents.toLocaleString("vi-VN") + " đ"
                  : "—"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AdminDashboard;
