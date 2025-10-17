import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Dữ liệu mẫu khóa học
  const myCourses = [
    {
      id: 1,
      icon: "fas fa-laptop-code",
      category: "Công nghệ",
      title: "React cho người mới",
      description: "Bắt đầu hành trình học React từ cơ bản tới nâng cao.",
      duration: "12 giờ",
      rating: 4.8,
      status: "Đang học - 60%",
      progress: 60,
    },
    {
      id: 2,
      icon: "fas fa-code",
      category: "Công nghệ",
      title: "JavaScript Advanced",
      description: "Nâng cao kỹ năng JavaScript của bạn.",
      duration: "15 giờ",
      rating: 4.9,
      status: "Đang học - 35%",
      progress: 35,
    },
    {
      id: 3,
      icon: "fas fa-database",
      category: "Backend",
      title: "Node.js & MongoDB",
      description: "Xây dựng backend mạnh mẽ với Node.js.",
      duration: "20 giờ",
      rating: 4.7,
      status: "Hoàn thành",
      progress: 100,
    },
  ];

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return (
      <section className="my-courses-page">
        <div className="container">
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-courses-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <i className="fas fa-book-reader"></i> Khóa học của tôi
          </h1>
          <p className="subtitle">
            Quản lý và tiếp tục học tập các khóa học đã đăng ký
          </p>
        </div>

        {myCourses.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>Bạn chưa đăng ký khóa học nào</h3>
            <p>Khám phá các khóa học phổ biến và bắt đầu học ngay hôm nay!</p>
            <a href="/courses" className="btn btn-primary">
              <i className="fas fa-search"></i> Khám phá khóa học
            </a>
          </div>
        ) : (
          <div className="courses-grid">
            {myCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-icon">
                  <i className={course.icon}></i>
                </div>
                <div className="course-content">
                  <span className="course-category">{course.category}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  <div className="course-progress">
                    <div className="progress-header">
                      <span>Tiến độ</span>
                      <span className="progress-percent">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="course-meta">
                    <span>
                      <i className="fas fa-clock"></i> {course.duration}
                    </span>
                    <span>
                      <i className="fas fa-star"></i> {course.rating}/5
                    </span>
                  </div>

                  <div
                    className={`course-status ${
                      course.progress === 100 ? "completed" : "in-progress"
                    }`}
                  >
                    {course.status}
                  </div>

                  <a
                    href={`/course/${course.id}`}
                    className="btn btn-primary btn-block"
                  >
                    <i className="fas fa-play"></i>
                    {course.progress === 100 ? "Xem lại" : "Tiếp tục học"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .my-courses-page {
          background: #f5f7fa;
          min-height: 100vh;
          padding: 3rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .page-header h1 i {
          color: #667eea;
        }

        .subtitle {
          color: #718096;
          font-size: 1.1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .empty-state i {
          font-size: 5rem;
          color: #cbd5e0;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #718096;
          margin-bottom: 2rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: 1fr;
          }
        }

        .course-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .course-card:hover {
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
          transform: translateY(-5px);
        }

        .course-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .course-icon i {
          font-size: 1.8rem;
          color: white;
        }

        .course-category {
          display: inline-block;
          background: #edf2f7;
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .course-title {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .course-description {
          color: #718096;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .course-progress {
          margin-bottom: 1.5rem;
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
          height: 10px;
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

        .course-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          color: #718096;
        }

        .course-meta span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .course-status {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .course-status.in-progress {
          background: #fef5e7;
          color: #f39c12;
        }

        .course-status.completed {
          background: #d5f4e6;
          color: #27ae60;
        }

        .btn-block {
          width: 100%;
          margin-top: auto;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </section>
  );
};

export default MyCourses;
