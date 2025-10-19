import React, { useState } from "react";

// Giao diện chi tiết khóa học - tiếng Việt
const CourseDetail = ({
  title = "Lập trình React từ cơ bản đến nâng cao",
  description = "Khóa học giúp bạn làm chủ React và xây dựng ứng dụng thực tế.",
  category = "Lập trình web",
  rating = 4.7,
  students = 1200,
  duration = "20 giờ",
  level = "Trung cấp",
  instructor = "Nguyễn Văn A",
  instructorTitle = "Senior Frontend Developer",
  instructorBio = "Giảng viên có 10 năm kinh nghiệm phát triển web với React, Node.js.",
  price = 199000,
  lectures = 45,
  assignments = 12,
  certificate = true,
  icon = "fas fa-laptop-code",
  defaultCourse = { id: 1 },
  fullDescription = "Khóa học này cung cấp kiến thức từ cơ bản đến nâng cao về React, giúp bạn tự tin xây dựng các ứng dụng web hiện đại.",
  learningOutcomes = [
    "Hiểu rõ về React và cách hoạt động",
    "Xây dựng giao diện web chuyên nghiệp",
    "Quản lý state hiệu quả",
    "Kết nối API và xử lý dữ liệu",
    "Triển khai ứng dụng lên môi trường thực tế",
  ],
  requirements = [
    "Biết sử dụng máy tính cơ bản",
    "Có kiến thức HTML, CSS, JavaScript cơ bản",
  ],
  curriculum = [
    {
      section: "Giới thiệu React",
      lectures: 5,
      duration: "2 giờ",
      lessons: [
        { title: "React là gì?", duration: "20 phút", free: true },
        { title: "Cài đặt môi trường", duration: "25 phút" },
      ],
    },
    {
      section: "Component & Props",
      lectures: 10,
      duration: "4 giờ",
      lessons: [
        { title: "Tạo component đầu tiên", duration: "30 phút" },
        { title: "Truyền props", duration: "35 phút", free: true },
      ],
    },
  ],
  reviews = [
    {
      id: 1,
      name: "Trần B",
      rating: 5,
      date: "10/10/2025",
      comment: "Khóa học rất hữu ích, giảng viên nhiệt tình!",
    },
    {
      id: 2,
      name: "Lê C",
      rating: 4,
      date: "12/10/2025",
      comment: "Nội dung dễ hiểu, thực hành nhiều.",
    },
  ],
  language = "Tiếng Việt",
  lastUpdated = "10/2025",
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <section className="course-detail-hero compact">
        <div className="container">
          <div className="course-detail-header">
            <div className="course-detail-info">
              <div className="course-breadcrumb">
                <a href="/courses">Khóa học</a>
                <i className="fas fa-chevron-right"></i>
                <span>{category}</span>
              </div>
              <h2>{title}</h2>
              <p className="course-subtitle">{description}</p>
              <div className="course-stats">
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span className="rating-number">{rating}</span>
                  <span className="rating-count">({students} đánh giá)</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span>{students.toLocaleString("vi-VN")} học viên</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span>{duration}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-signal"></i>
                  <span>{level}</span>
                </div>
              </div>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="instructor-details">
                  <span className="instructor-label">Giảng viên</span>
                  <span className="instructor-name">{instructor}</span>
                </div>
              </div>
            </div>
            <div className="course-detail-card">
              <div className="course-card-preview">
                <div className="course-preview-icon">
                  <i className={icon}></i>
                </div>
              </div>
              <div className="course-card-body">
                <div className="course-price-box">
                  <span className="course-price-main">
                    {price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="course-price-old">299.000đ</span>
                  <span className="course-discount">-33%</span>
                </div>
                <a
                  href={`/payment/${defaultCourse.id}`}
                  className="btn btn-enroll"
                >
                  <i className="fas fa-shopping-cart"></i> Đăng ký ngay
                </a>
                <div className="course-includes">
                  <h4>Khóa học bao gồm:</h4>
                  <ul>
                    <li>
                      <i className="fas fa-play-circle"></i> {lectures} bài
                      giảng
                    </li>
                    <li>
                      <i className="fas fa-tasks"></i> {assignments} bài tập
                    </li>
                    <li>
                      <i className="fas fa-infinity"></i> Truy cập trọn đời
                    </li>
                    <li>
                      <i className="fas fa-mobile-alt"></i> Học trên mọi thiết
                      bị
                    </li>
                    {certificate && (
                      <li>
                        <i className="fas fa-certificate"></i> Chứng chỉ hoàn
                        thành
                      </li>
                    )}
                    <li>
                      <i className="fas fa-headset"></i> Hỗ trợ trực tuyến
                    </li>
                  </ul>
                </div>
                <div className="course-share">
                  <button className="btn-share">
                    <i className="fas fa-share-alt"></i> Chia sẻ
                  </button>
                  <button className="btn-wishlist">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="course-detail-content">
        <div className="container">
          <div
            className="content-wrapper"
            style={{ display: "flex", gap: "32px" }}
          >
            <div className="content-main" style={{ flex: 1 }}>
              <div className="course-tabs">
                <button
                  className={`tab-btn ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Tổng quan
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "curriculum" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Nội dung khóa học
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "instructor" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("instructor")}
                >
                  Giảng viên
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Đánh giá
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <div className="content-section">
                      <h2>Mô tả khóa học</h2>
                      <p>{fullDescription}</p>
                    </div>
                    <div className="content-section">
                      <h2>Bạn sẽ học được gì?</h2>
                      <div className="learning-outcomes">
                        {learningOutcomes.map((outcome, idx) => (
                          <div key={idx} className="outcome-item">
                            <i className="fas fa-check-circle"></i>
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="content-section">
                      <h2>Yêu cầu</h2>
                      <ul className="requirements-list">
                        {requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === "curriculum" && (
                  <div className="curriculum-content">
                    <div className="curriculum-header">
                      <h2>Nội dung khóa học</h2>
                      <p>
                        {curriculum.length} phần • {lectures} bài giảng •{" "}
                        {duration} tổng thời lượng
                      </p>
                    </div>
                    <div className="curriculum-list">
                      {curriculum.map((section, idx) => (
                        <div key={idx} className="curriculum-section">
                          <div className="section-header">
                            <div className="section-title">
                              <i className="fas fa-folder"></i>{" "}
                              <span>{section.section}</span>
                            </div>
                            <div className="section-info">
                              {section.lectures} bài giảng • {section.duration}
                            </div>
                          </div>
                          <div className="section-lessons">
                            {section.lessons.map((lesson, lessonIdx) => (
                              <div key={lessonIdx} className="lesson-item">
                                <div className="lesson-title">
                                  <i className="fas fa-play-circle"></i>{" "}
                                  <span>{lesson.title}</span>
                                  {lesson.free && (
                                    <span className="lesson-free">Xem thử</span>
                                  )}
                                </div>
                                <div className="lesson-duration">
                                  <i className="far fa-clock"></i>{" "}
                                  {lesson.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "instructor" && (
                  <div className="instructor-content">
                    <div className="instructor-profile">
                      <div className="instructor-avatar-large">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="instructor-bio">
                        <h2>{instructor}</h2>
                        <p className="instructor-title-text">
                          {instructorTitle}
                        </p>
                        <div className="instructor-stats">
                          <div className="stat">
                            <i className="fas fa-star"></i> {rating} Đánh giá
                          </div>
                          <div className="stat">
                            <i className="fas fa-users"></i>{" "}
                            {students.toLocaleString("vi-VN")} Học viên
                          </div>
                          <div className="stat">
                            <i className="fas fa-play-circle"></i> {lectures}{" "}
                            Khóa học
                          </div>
                        </div>
                        <p className="instructor-description">
                          {instructorBio}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-number-large">{rating}</div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fas fa-star ${
                                star <= rating ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="rating-text">Đánh giá khóa học</div>
                      </div>
                    </div>
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-avatar">
                              <i className="fas fa-user-circle"></i>
                            </div>
                            <div className="reviewer-info">
                              <h4>{review.name}</h4>
                              <div className="review-meta">
                                <div className="review-rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fas fa-star ${
                                        star <= review.rating ? "filled" : ""
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="review-date">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="content-sidebar" style={{ width: "260px" }}>
              <div className="sidebar-card">
                <h3>Thông tin khóa học</h3>
                <ul className="course-info-list">
                  <li>
                    <i className="fas fa-language"></i>{" "}
                    <div>
                      <strong>Ngôn ngữ</strong> <span>{language}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    <div>
                      <strong>Cập nhật</strong> <span>{lastUpdated}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-signal"></i>{" "}
                    <div>
                      <strong>Trình độ</strong> <span>{level}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-play-circle"></i>{" "}
                    <div>
                      <strong>Bài giảng</strong> <span>{lectures} bài</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-tasks"></i>{" "}
                    <div>
                      <strong>Bài tập</strong> <span>{assignments} bài</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-certificate"></i>{" "}
                    <div>
                      <strong>Chứng chỉ</strong>{" "}
                      <span>{certificate ? "Có" : "Không"}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="sidebar-card">
                <h3>Khóa học liên quan</h3>
                <div className="related-courses">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="related-course-item">
                      <div className="related-course-icon">
                        <i className="fas fa-code"></i>
                      </div>
                      <div className="related-course-info">
                        <h4>Khóa học {i}</h4>
                        <p className="related-course-price">199.000đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
