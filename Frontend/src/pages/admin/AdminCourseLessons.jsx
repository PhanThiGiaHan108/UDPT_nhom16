import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AdminCourseLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/courses/${id}`);
        setCourse(res.data);
        // Nếu curriculum là dạng section, gộp tất cả lessons lại thành 1 mảng
        let allLessons = [];
        if (Array.isArray(res.data.curriculum)) {
          if (res.data.curriculum.length > 0 && res.data.curriculum[0].lessons) {
            // curriculum dạng section
            res.data.curriculum.forEach(section => {
              if (Array.isArray(section.lessons)) {
                allLessons = allLessons.concat(section.lessons);
              }
            });
          } else {
            // curriculum là mảng bài giảng trực tiếp
            allLessons = res.data.curriculum;
          }
        }
        setLessons(allLessons);
      } catch (err) {
        setError("Không thể tải khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddLesson = () => {
    if (!lessonTitle || !lessonVideo) return;
    setLessons([...lessons, { title: lessonTitle, video: lessonVideo }]);
    setLessonTitle("");
    setLessonVideo("");
  };

  const handleRemoveLesson = (idx) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  const handleSaveLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      // Đảm bảo curriculum là mảng section, mỗi section có lessons
      const curriculum = [
        {
          section: "Bài giảng",
          lectures: lessons.length,
          duration: "",
          lessons: lessons.map(l => ({
            title: l.title,
            videoUrl: l.video || l.videoUrl || "",
            duration: l.duration || "",
            free: l.free || false
          }))
        }
      ];
      await api.put(`/api/courses/${id}`, { curriculum }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Cập nhật bài giảng thành công!");
      // Fetch lại course để đồng bộ danh sách bài giảng
      const res = await api.get(`/api/courses/${id}`);
      setCourse(res.data);
      let allLessons = [];
      if (Array.isArray(res.data.curriculum)) {
        res.data.curriculum.forEach(section => {
          if (Array.isArray(section.lessons)) {
            allLessons = allLessons.concat(section.lessons);
          }
        });
      }
      setLessons(allLessons);
    } catch (err) {
      setError("Không thể cập nhật bài giảng");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-container" style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 16px #e5e7eb', padding: 32, marginTop: 32 }}>
        <h2 style={{ marginBottom: 24, color: '#2563eb' }}>Quản lý bài giảng: <span style={{ color: '#111' }}>{course?.title}</span></h2>
        {success && <div style={{ color: '#10b981', marginBottom: 12 }}>{success}</div>}
        <form onSubmit={e => { e.preventDefault(); handleAddLesson(); }} style={{ display: 'flex', gap: 12, margin: '16px 0', alignItems: 'center' }}>
          <input type="text" placeholder="Tên bài giảng" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required style={{ flex: 2, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 15 }} />
          <input type="text" placeholder="Link video bài giảng" value={lessonVideo} onChange={e => setLessonVideo(e.target.value)} required style={{ flex: 3, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 15 }} />
          <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: 15, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>Thêm bài giảng</button>
        </form>
        <ul style={{ maxWidth: 600, padding: 0, margin: '24px 0 0 0', listStyle: 'none' }}>
          {lessons.length === 0 && <li style={{ color: '#888', fontSize: 15 }}>Chưa có bài giảng nào.</li>}
          {lessons.map((l, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, background: '#f7fafc', borderRadius: 6, padding: '10px 14px' }}>
              <span style={{ flex: 1, fontWeight: 500, color: '#222', fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <i className="fas fa-play-circle" style={{ marginRight: 8, color: '#2563eb' }}></i>{l.title}
                <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>{l.video}</span>
              </span>
              <button onClick={() => handleRemoveLesson(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15, marginLeft: 12 }}>Xóa</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <button onClick={handleSaveLessons} style={{ padding: '10px 22px', borderRadius: 6, fontWeight: 600, fontSize: 16, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>Lưu danh sách bài giảng</button>
          <button onClick={() => navigate(-1)} style={{ padding: '10px 22px', borderRadius: 6, fontWeight: 600, fontSize: 16, background: '#e5e7eb', color: '#222', border: 'none', cursor: 'pointer' }}>← Quay lại</button>
        </div>
      </div>
    </>
  );
};

export default AdminCourseLessons;
