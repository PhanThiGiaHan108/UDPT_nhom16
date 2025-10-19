import React from 'react';

const Features = () => (
  <section className="features">
    <div className="container">
      <h2 className="section-title">Tính năng nổi bật</h2>
      <div className="features-grid">
        <div className="feature-card">
          <i className="fas fa-chalkboard-teacher"></i>
          <h3>Giảng viên chất lượng</h3>
          <p>Đội ngũ giảng viên giàu kinh nghiệm, tận tâm và chuyên môn cao.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-laptop-code"></i>
          <h3>Khóa học đa dạng</h3>
          <p>Nhiều chủ đề, lĩnh vực khác nhau phù hợp với mọi đối tượng học viên.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-certificate"></i>
          <h3>Chứng nhận uy tín</h3>
          <p>Nhận chứng nhận sau khi hoàn thành khóa học, nâng cao giá trị bản thân.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-user-friends"></i>
          <h3>Cộng đồng học tập</h3>
          <p>Kết nối, trao đổi và học hỏi cùng cộng đồng học viên năng động.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
