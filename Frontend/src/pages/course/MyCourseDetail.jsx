import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Bài giảng đang chọn để xem video
  const [selectedLesson, setSelectedLesson] = useState(null);
  // Trạng thái đã xem bài giảng
  const [watchedLessons, setWatchedLessons] = useState({});
  // Tính tiến độ học (phần trăm số bài giảng đã xem)
  let totalLessons = 0;
  let watchedCount = 0;
  if (course && Array.isArray(course.curriculum)) {
    totalLessons = course.curriculum.reduce((acc, section) => acc + (section.lessons ? section.lessons.length : 0), 0);
    watchedCount = Object.values(watchedLessons).filter(Boolean).length;
  }
  const progressPercent = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
  // Lấy userId cho localStorage key
  const userStr = localStorage.getItem("user");
  let userId = null;
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user._id || user.id;
    }
  } catch {}
  const watchedKey = userId && course ? `watched_${userId}_${course._id}` : null;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5002/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("Không tải được thông tin khóa học.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Load watched lessons từ localStorage khi course load
  useEffect(() => {
    if (watchedKey) {
      try {
        const data = localStorage.getItem(watchedKey);
        if (data) setWatchedLessons(JSON.parse(data));
      } catch {}
    }
  }, [watchedKey]);

  // Đánh dấu đã xem bài giảng
  const handleMarkWatched = (lessonId) => {
    if (!watchedKey || !lessonId) return;
    setWatchedLessons((prev) => {
      const updated = { ...prev, [lessonId]: true };
      localStorage.setItem(watchedKey, JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return <div style={{ padding: 40 }}>Đang tải...</div>;
  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/my-courses">Quay lại Khóa học của tôi</Link>
      </div>
    );

  return (
    <div className="my-course-detail" style={{ padding: 40 }}>
      <h2>🎓 {course.title}</h2>
      <p style={{ color: "#666" }}>{course.description}</p>

      <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
        <div style={{ flex: 1, border: "1px solid #eee", padding: 20 }}>
          <h4>Trạng thái đăng ký</h4>
          <p>✅ Đã đăng ký</p>
          <p>📅 Đăng ký: {new Date().toLocaleDateString("vi-VN")}</p>
          <div style={{ margin: '12px 0' }}>
            <span style={{ fontWeight: 600 }}>📈 Tiến độ: </span>
            <span style={{ color: progressPercent === 100 ? '#10b981' : '#2563eb', fontWeight: 700 }}>
              {watchedCount}/{totalLessons} bài giảng ({progressPercent}%)
            </span>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: `${progressPercent}%`, height: 8, background: progressPercent === 100 ? '#10b981' : '#2563eb', borderRadius: 6, transition: 'width 0.3s' }}></div>
            </div>
          </div>

          {/* Danh sách bài giảng */}
          <div style={{ marginTop: 32 }}>
            <h4>Nội dung khóa học</h4>
            {Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
              <div>
                {course.curriculum.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      <i className="fas fa-folder"></i> {section.section}
                    </div>
                    <ul style={{ paddingLeft: 18 }}>
                      {(section.lessons || []).map((lesson, lidx) => (
                        <li key={lidx} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <i className="fas fa-play-circle"></i>
                          <span style={{ cursor: lesson.videoUrl ? 'pointer' : 'default', color: lesson.videoUrl ? '#007bff' : undefined }}
                            onClick={() => lesson.videoUrl && setSelectedLesson({ ...lesson, section: section.section })}
                          >{lesson.title}</span>
                          {lesson._id && (
                            <button
                              onClick={() => handleMarkWatched(lesson._id)}
                              style={{
                                marginLeft: 8,
                                padding: '2px 10px',
                                borderRadius: 6,
                                border: watchedLessons[lesson._id] ? '1px solid #10b981' : '1px solid #e5e7eb',
                                background: watchedLessons[lesson._id] ? '#10b981' : '#fff',
                                color: watchedLessons[lesson._id] ? '#fff' : '#111827',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              disabled={watchedLessons[lesson._id]}
                            >
                              {watchedLessons[lesson._id] ? 'Đã xem' : 'Đánh dấu đã xem'}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', marginTop: 8 }}>Chưa có nội dung bài giảng.</div>
            )}
          </div>

          {/* Video bài giảng và nút Đã xem */}
          {selectedLesson && selectedLesson.videoUrl && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <h4>{selectedLesson.title}</h4>
              {selectedLesson.videoUrl.includes('youtube.com') || selectedLesson.videoUrl.includes('youtu.be') ? (
                <iframe
                  width="640"
                  height="360"
                  src={
                    selectedLesson.videoUrl.includes('watch?v=')
                      ? selectedLesson.videoUrl.replace('watch?v=', 'embed/')
                      : selectedLesson.videoUrl.replace('youtu.be/', 'youtube.com/embed/')
                  }
                  title="Video bài giảng"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', maxWidth: '100%' }}
                ></iframe>
              ) : (
                <video
                  width="640"
                  height="360"
                  controls
                  style={{ borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', maxWidth: '100%' }}
                >
                  <source src={selectedLesson.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              )}
              {/* Nút Đã xem dưới video */}
              {selectedLesson._id && (
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => handleMarkWatched(selectedLesson._id)}
                    style={{
                      padding: '6px 18px',
                      borderRadius: 8,
                      border: watchedLessons[selectedLesson._id] ? '1px solid #10b981' : '1px solid #e5e7eb',
                      background: watchedLessons[selectedLesson._id] ? '#10b981' : '#fff',
                      color: watchedLessons[selectedLesson._id] ? '#fff' : '#111827',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: watchedLessons[selectedLesson._id] ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                    disabled={watchedLessons[selectedLesson._id]}
                  >
                    {watchedLessons[selectedLesson._id] ? 'Đã xem' : 'Đánh dấu đã xem'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ width: 320, border: "1px solid #eee", padding: 20 }}>
          <h4>Hành động</h4>
          <button
            onClick={() => navigate(`/course/${id}`)}
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "#7b2ff2",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Bắt đầu học
          </button>
          <Link to="/my-courses" style={{ display: "block", marginTop: 12 }}>
            ← Quay lại Khóa học của tôi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetail;
