import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";
import "./admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
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
        <h1 className="admin-title">Quản lý học viên</h1>
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id.substring(0, 8)}...</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role === "admin" ? "Admin" : "Học viên"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleString("vi-VN")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="admin-empty">
                  Chưa có người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};

export default AdminUsers;
