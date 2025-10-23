import React from "react";
import { Link } from "react-router-dom";

function MyCourses({ courses }) {
  const safeCourses = Array.isArray(courses) ? courses : [];
  return (
    <div className="my-courses" style={{ padding: "40px" }}>
      <h2>📚 Khóa học của tôi</h2>
  {safeCourses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Bạn chưa đăng ký khóa học nào.</p>
          <Link
            to="/courses"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            🔍 Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {safeCourses.map((course) => {
            let totalLessons = 0;
            let watchedCount = 0;
            let progressPercent = 0;
            try {
              const userStr = localStorage.getItem("user");
              let userId = null;
              if (userStr) {
                const user = JSON.parse(userStr);
                userId = user._id || user.id;
              }
              const watchedKey = userId && course ? `watched_${userId}_${course._id}` : null;
              let watchedLessons = {};
              if (watchedKey) {
                const data = localStorage.getItem(watchedKey);
                if (data) watchedLessons = JSON.parse(data);
              }
              if (Array.isArray(course.curriculum)) {
                totalLessons = course.curriculum.reduce((acc, section) => acc + (section.lessons ? section.lessons.length : 0), 0);
                watchedCount = Object.values(watchedLessons).filter(Boolean).length;
                progressPercent = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
              }
            } catch {}
            return (
              <div
                key={course._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginBottom: "15px",
                    }}
                  />
                )}
                <h3 style={{ margin: "10px 0", fontSize: "18px" }}>{course.title}</h3>
                <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", marginBottom: "15px" }}>
                  {course.description?.substring(0, 100)}
                  {course.description?.length > 100 && "..."}
                </p>
                <div style={{ marginBottom: "10px", display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ backgroundColor: "#4CAF50", color: "white", padding: "4px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
                    ✅ Đã đăng ký
                  </span>
                  {progressPercent === 100 && (
                    <span style={{ backgroundColor: "#10b981", color: "white", padding: "4px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
                      🏆 Đã hoàn thành
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "#999" }}>
                  📅 Đăng ký: {new Date(course.enrolledAt).toLocaleDateString("vi-VN")}
                </p>
                <Link
                  to={`/my-courses/${course._id}`}
                  style={{
                    display: "block",
                    marginTop: "15px",
                    padding: "10px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Vào học ngay →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

}

export default MyCourses;
