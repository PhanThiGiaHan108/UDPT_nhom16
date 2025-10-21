import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";
import "./admin.css";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "",
    image: "",
    category: "",
    title: "",
    description: "",
    duration: "",
    price: "0",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/courses");
      setCourses(response.data.data || []); // API trả về { data: courses }
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      // Chuẩn bị data với price là number
      const courseData = {
        ...formData,
        price: Number(formData.price) || 0,
        students: 0,
        rating: 0,
      };
      
      await api.post("/api/courses", courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess("Thêm khóa học thành công!");
      setFormData({
        icon: "",
        image: "",
        category: "",
        title: "",
        description: "",
        duration: "",
        price: "0",
      });
      setShowForm(false); // Ẩn form sau khi thêm thành công
      fetchCourses();
    } catch (err) {
      console.error("Create course error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || "Không thể thêm khóa học");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa khóa học thành công!");
      fetchCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      setError(err.response?.data?.message || "Không thể xóa khóa học");
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
        <h1 className="admin-title">Quản lý khóa học</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!showForm && (
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(true)}
          style={{ marginBottom: "2rem" }}
        >
          + Thêm khóa học mới
        </button>
      )}

      {showForm && (
        <div className="admin-form">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0 }}>Thêm khóa học mới</h3>
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#718096"
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Icon (class)</label>
            <input
              type="text"
              name="icon"
              placeholder="fab fa-js-square"
              value={formData.icon}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Ảnh khóa học (URL)</label>
            <input
              type="text"
              name="image"
              placeholder="https://.../thumb.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Data Science">Data Science</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Thời lượng</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="10 giờ"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Giá (VND)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="1000"
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="btn-primary" type="submit">
              Thêm khóa học
            </button>
          </form>
        </div>
      )}

      <div className="admin-courses-grid">
        {courses && courses.length > 0 ? (
          courses.map((c) => (
              <div key={c._id} className="admin-course-card">
                <button
                  onClick={() => handleDelete(c._id)}
                  className="btn-danger"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  Xóa
                </button>
                {c.image ? (
                  <img src={c.image} alt={c.title} />
                ) : (
                  <div style={{ 
                    width: "100%", 
                    height: "200px", 
                    background: "#f7fafc", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "3rem",
                    color: "#cbd5e0"
                  }}>
                    <i className={c.icon || "fas fa-book"}></i>
                  </div>
                )}
                <div className="course-info">
                  <h4>{c.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.5rem 0" }}>
                    {c.description?.substring(0, 100)}...
                  </p>
                  <div className="course-meta">
                    <span>{c.category || "Khác"}</span> · 
                    <span> {c.students || "0"} học viên</span> · 
                    <span> {Number(c.price || 0).toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#a0aec0", marginTop: "0.5rem" }}>
                    {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-empty">Chưa có khóa học.</div>
          )}
      </div>
      </div>
    </>
  );
};
  
export default AdminCourses;
