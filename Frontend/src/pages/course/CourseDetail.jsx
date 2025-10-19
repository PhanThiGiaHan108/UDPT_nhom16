import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  // Track which section's first lesson video is open
  const [openPreviewSection, setOpenPreviewSection] = useState(null);
  // Track which sections are expanded (collapsed by default)
  const [expandedSections, setExpandedSections] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5002/api/courses/${id}`);
        const data = await res.json();
        if (data && data._id) {
          setCourse(data);
        } else {
          setError(data?.message || "Không tìm thấy khóa học!");
        }
      } catch {
        setError("Không thể tải chi tiết khóa học!");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Đang tải chi tiết khóa học...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", padding: 40 }}>
        {error} • <Link to="/courses">Quay lại danh sách</Link>
      </div>
    );
  }
  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Không tìm thấy khóa học! • <Link to="/courses">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <section className="course-detail-hero compact">
        <div className="container">
          <div className="course-detail-header">
            <div className="course-detail-info">
              <div className="course-breadcrumb">
                <Link to="/courses">Khóa học</Link>
                <i
                  className="fas fa-chevron-right"
                  style={{ margin: "0 8px" }}
                />
                <span>{course.category}</span>
              </div>
              <h2>{course.title}</h2>
              <p className="course-subtitle">{course.description}</p>
              <div className="course-stats">
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span className="rating-number">{course.rating || 4.5}</span>
                  <span className="rating-count">
                    ({course.students || 0} đánh giá)
                  </span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span>
                    {(course.students || 0).toLocaleString("vi-VN")} học viên
                  </span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span>{course.duration || "20 giờ"}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-signal"></i>
                  <span>{course.level || "Trung cấp"}</span>
                </div>
              </div>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="instructor-details">
                  <span className="instructor-label">Giảng viên</span>
                  <span className="instructor-name">
                    {course.instructor || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
              {/* Tabs moved here under instructor name */}
              <div className="course-tabs" style={{ marginTop: 24 }}>
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

              <div className="tab-content" style={{ marginTop: 12 }}>
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <div className="content-section">
                      <h2>Mô tả khóa học</h2>
                      <p>{course.fullDescription || course.description}</p>
                    </div>
                    <div className="content-section">
                      <h2>Bạn sẽ học được gì?</h2>
                      <div className="learning-outcomes">
                        {(course.learningOutcomes || []).map((outcome, idx) => (
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
                        {(course.requirements || []).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="curriculum-content">
                    {course.previewVideo && (
                      <div
                        className="course-preview-video"
                        style={{
                          marginBottom: 30,
                          padding: 20,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                      >
                        <h3
                          style={{
                            marginBottom: 15,
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          Video giới thiệu khóa học
                        </h3>
                        {course.previewVideo.includes("youtube.com") ||
                        course.previewVideo.includes("youtu.be") ? (
                          <iframe
                            width="640"
                            height="360"
                            src={
                              course.previewVideo.includes("watch?v=")
                                ? course.previewVideo.replace(
                                    "watch?v=",
                                    "embed/"
                                  )
                                : course.previewVideo.replace(
                                    "youtu.be/",
                                    "youtube.com/embed/"
                                  )
                            }
                            title="Course preview video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              borderRadius: 8,
                              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                              maxWidth: "100%",
                            }}
                          ></iframe>
                        ) : (
                          <video
                            width="640"
                            height="360"
                            controls
                            style={{
                              borderRadius: 8,
                              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                              maxWidth: "100%",
                            }}
                          >
                            <source
                              src={course.previewVideo}
                              type="video/mp4"
                            />
                            Trình duyệt của bạn không hỗ trợ video.
                          </video>
                        )}
                      </div>
                    )}
                    <div className="curriculum-list">
                      {(course.curriculum || []).map((section, idx) => {
                        const isExpanded = expandedSections.includes(idx);
                        return (
                          <div key={idx} className="curriculum-section">
                            <div
                              className="section-header"
                              onClick={() => {
                                setExpandedSections((prev) =>
                                  prev.includes(idx)
                                    ? prev.filter((i) => i !== idx)
                                    : [...prev, idx]
                                );
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="section-title">
                                <i
                                  className={`fas fa-chevron-${
                                    isExpanded ? "down" : "right"
                                  }`}
                                  style={{
                                    marginRight: 8,
                                    fontSize: 12,
                                    transition: "transform 0.3s ease",
                                  }}
                                ></i>
                                <i className="fas fa-folder"></i>{" "}
                                <span>{section.section}</span>
                              </div>
                              <div className="section-info">
                                {section.lectures} bài giảng •{" "}
                                {section.duration}
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="section-lessons">
                                {(section.lessons || []).map(
                                  (lesson, lessonIdx) => {
                                    const isFirst = lessonIdx === 0;
                                    return (
                                      <div
                                        key={lessonIdx}
                                        className="lesson-item"
                                      >
                                        <div className="lesson-title">
                                          <i className="fas fa-play-circle"></i>{" "}
                                          <span>{lesson.title}</span>
                                          {isFirst ? (
                                            <span
                                              className="lesson-free"
                                              style={{
                                                cursor: lesson.videoUrl
                                                  ? "pointer"
                                                  : "default",
                                                color: lesson.videoUrl
                                                  ? "#007bff"
                                                  : undefined,
                                                marginLeft: 8,
                                              }}
                                              onClick={() =>
                                                lesson.videoUrl &&
                                                setOpenPreviewSection(
                                                  openPreviewSection === idx
                                                    ? null
                                                    : idx
                                                )
                                              }
                                            >
                                              Xem thử
                                            </span>
                                          ) : (
                                            <span
                                              className="lesson-locked"
                                              style={{
                                                color: "#888",
                                                marginLeft: 8,
                                              }}
                                            >
                                              <i className="fas fa-lock"></i> Đã
                                              khóa
                                            </span>
                                          )}
                                        </div>
                                        <div className="lesson-duration">
                                          <i className="far fa-clock"></i>{" "}
                                          {lesson.duration}
                                        </div>
                                        {isFirst &&
                                          lesson.videoUrl &&
                                          openPreviewSection === idx && (
                                            <div
                                              className="lesson-video-preview"
                                              style={{
                                                marginTop: 12,
                                                textAlign: "center",
                                              }}
                                            >
                                              {lesson.videoUrl.includes(
                                                "youtube.com"
                                              ) ||
                                              lesson.videoUrl.includes(
                                                "youtu.be"
                                              ) ? (
                                                <iframe
                                                  width="640"
                                                  height="360"
                                                  src={
                                                    lesson.videoUrl.includes(
                                                      "watch?v="
                                                    )
                                                      ? lesson.videoUrl.replace(
                                                          "watch?v=",
                                                          "embed/"
                                                        )
                                                      : lesson.videoUrl.replace(
                                                          "youtu.be/",
                                                          "youtube.com/embed/"
                                                        )
                                                  }
                                                  title="YouTube video preview"
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                                  style={{
                                                    borderRadius: 8,
                                                    boxShadow:
                                                      "0 2px 12px rgba(0,0,0,0.15)",
                                                  }}
                                                ></iframe>
                                              ) : (
                                                <video
                                                  width="640"
                                                  height="360"
                                                  controls
                                                  style={{
                                                    borderRadius: 8,
                                                    boxShadow:
                                                      "0 2px 12px rgba(0,0,0,0.15)",
                                                  }}
                                                >
                                                  <source
                                                    src={lesson.videoUrl}
                                                    type="video/mp4"
                                                  />
                                                  Trình duyệt của bạn không hỗ
                                                  trợ video.
                                                </video>
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                        <h2>{course.instructor || "Chưa cập nhật"}</h2>
                        <p className="instructor-title-text">
                          {course.instructorTitle || ""}
                        </p>
                        <div className="instructor-stats">
                          <div className="stat">
                            <i className="fas fa-star"></i>{" "}
                            {course.rating || 4.5} Đánh giá
                          </div>
                          <div className="stat">
                            <i className="fas fa-users"></i>{" "}
                            {(course.students || 0).toLocaleString("vi-VN")} Học
                            viên
                          </div>
                          <div className="stat">
                            <i className="fas fa-play-circle"></i>{" "}
                            {course.lectures || 0} Khóa học
                          </div>
                        </div>
                        <p className="instructor-description">
                          {course.instructorBio || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-number-large">
                          {course.rating || 4.5}
                        </div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fas fa-star ${
                                star <= (course.rating || 4.5) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="rating-text">Đánh giá khóa học</div>
                      </div>
                    </div>
                    <div className="reviews-list">
                      {(course.reviews || []).map((review, idx) => (
                        <div key={idx} className="review-item">
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
            <div className="course-detail-card">
              <div className="course-card-preview">
                <div className="course-preview-icon">
                  <i className={course.icon || "fas fa-laptop-code"}></i>
                </div>
              </div>
              <div className="course-card-body">
                <div className="course-price-box">
                  <span className="course-price-main">
                    {(course.price || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <a href={`/payment/${course._id}`} className="btn btn-enroll">
                  <i className="fas fa-shopping-cart"></i> Đăng ký ngay
                </a>
                <div className="course-includes">
                  <h4>Khóa học bao gồm:</h4>
                  <ul>
                    <li>
                      <i className="fas fa-play-circle"></i>{" "}
                      {course.lectures || 0} bài giảng
                    </li>
                    <li>
                      <i className="fas fa-tasks"></i> {course.assignments || 0}{" "}
                      bài tập
                    </li>
                    <li>
                      <i className="fas fa-infinity"></i> Truy cập trọn đời
                    </li>
                    <li>
                      <i className="fas fa-mobile-alt"></i> Học trên mọi thiết
                      bị
                    </li>
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
    </div>
  );
};

export default CourseDetail;
