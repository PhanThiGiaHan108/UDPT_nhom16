import React from "react";
import { Link } from "react-router-dom";

const Courses = ({ courses = [] }) => (
  <>
    <section className="page-header">
      <div className="container">
        <h1>Khóa học</h1>
        <p>Khám phá các khóa học phổ biến và mới nhất trên EduLearn.</p>
      </div>
    </section>

    <section className="courses">
      <div className="container">
        <div className="courses-grid">
          {courses.map((course, idx) => (
            <div key={course.id || idx} className="course-card">
              <div className="course-image">
                <i className={course.icon}></i>
              </div>
              <div className="course-content">
                <span className="course-category">{course.category}</span>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span>
                    <i className="fas fa-clock"></i> {course.duration}
                  </span>
                  <span>
                    <i className="fas fa-users"></i> {course.students} học viên
                  </span>
                  <span>
                    <i className="fas fa-star"></i> {course.rating}/5
                  </span>
                </div>
                <div className="course-price">
                  {course.price?.toLocaleString("vi-VN")}đ
                </div>
                <div
                  className="course-actions"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/payment/${course.id}`}
                    className="btn btn-register"
                    style={{ padding: "10px 16px" }}
                  >
                    Đăng ký ngay
                  </Link>
                  <Link to={`/course/${course.id}`} className="btn btn-info">
                    <i className="fas fa-info-circle"></i> Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Courses;
