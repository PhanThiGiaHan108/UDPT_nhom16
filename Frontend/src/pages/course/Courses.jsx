import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]); // all courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Lấy tất cả khóa học (tăng limit để gom nhóm theo category ở frontend)
        const res = await axios.get("http://localhost:5002/api/courses", {
          params: { limit: 9999 },
        });
        setCourses(res.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học!");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Debounce input tìm kiếm để tránh lọc liên tục
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(search.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(t);
  }, [search]);

  // Đồng bộ category từ URL query (?category=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  // Tính danh sách category từ dữ liệu
  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [courses]);

  // Lọc theo search
  const filtered = useMemo(() => {
    if (!debouncedSearch) return courses;
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(debouncedSearch) ||
        c.description?.toLowerCase().includes(debouncedSearch)
    );
  }, [courses, debouncedSearch]);

  // Gom nhóm theo category
  const groupedByCategory = useMemo(() => {
    const map = new Map();
    filtered.forEach((c) => {
      const cat = c.category || "Khác";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(c);
    });
    return map;
  }, [filtered]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Đang tải khóa học...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", padding: 40 }}>
        {error}
      </div>
    );

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 style={{ marginBottom: 8 }}>Khóa học</h1>
          <p>Khám phá và tìm kiếm khóa học theo danh mục trên EduLearn.</p>
          <div
            className="course-filters"
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              className="search-box"
              style={{ position: "relative", flex: 1, minWidth: 260 }}
            >
              <i
                className="fas fa-search"
                style={{
                  position: "absolute",
                  top: 10,
                  left: 12,
                  color: "#888",
                }}
              ></i>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  outline: "none",
                }}
              />
            </div>
            <div
              className="categories"
              style={{ display: "flex", gap: 8, overflowX: "auto" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    background: activeCategory === cat ? "#111827" : "#fff",
                    color: activeCategory === cat ? "#fff" : "#111827",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="courses" style={{ paddingTop: 0 }}>
        <div className="container">
          {activeCategory === "all"
            ? // Hiển thị theo nhóm category
              Array.from(groupedByCategory.entries()).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "12px 0",
                    }}
                  >
                    <h2 style={{ fontSize: 22 }}>
                      {cat}{" "}
                      <span style={{ color: "#6b7280", fontSize: 16 }}>
                        ({list.length})
                      </span>
                    </h2>
                    <Link
                      to={`/courses?category=${encodeURIComponent(cat)}`}
                      style={{ color: "#2563eb", fontWeight: 600 }}
                    >
                      Xem tất cả
                    </Link>
                  </div>
                  <div
                    className="courses-grid"
                    style={{
                      display: "grid",
                      gap: 16,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                    }}
                  >
                    {list.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </div>
              ))
            : // Hiển thị một category được chọn
              (() => {
                const list = filtered.filter(
                  (c) => c.category === activeCategory
                );
                return list.length ? (
                  <div
                    className="courses-grid"
                    style={{
                      display: "grid",
                      gap: 16,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                    }}
                  >
                    {list.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 32,
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy khóa học trong danh mục này.
                  </div>
                );
              })()}
        </div>
      </section>
    </>
  );
};

const CourseCard = ({ course }) => (
  <div
    className="course-card"
    style={{
      border: "1px solid #eee",
      borderRadius: 12,
      overflow: "hidden",
      background: "#fff",
    }}
  >
    <div
      className="course-image"
      style={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}
    >
      <i
        className={course.icon || "fas fa-laptop-code"}
        style={{ fontSize: 40, color: "#374151" }}
      ></i>
    </div>
    <div className="course-content" style={{ padding: 16 }}>
      <span
        className="course-category"
        style={{ fontSize: 12, color: "#6b7280" }}
      >
        {course.category}
      </span>
      <h3
        className="course-title"
        style={{ fontSize: 16, margin: "6px 0 0 0" }}
      >
        {course.title}
      </h3>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 10,
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        <span>
          <i className="fas fa-signal"></i> {course.level || "All levels"}
        </span>
        <span>
          <i className="fas fa-clock"></i> {course.duration || "--"}
        </span>
      </div>
      <div
        className="course-price"
        style={{
          marginTop: 12,
          fontWeight: 700,
          color: "#e11d48",
          fontSize: 18,
        }}
      >
        {course.price?.toLocaleString("vi-VN")}đ
      </div>
      <div
        className="course-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Link
          to={`/course/${course._id}`}
          className="btn btn-register"
          style={{
            padding: "8px 14px",
            fontWeight: 600,
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          Xem chi tiết
        </Link>
        <button
          style={{
            padding: "8px 14px",
            fontWeight: 600,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>
    </div>
  </div>
);

export default Courses;
