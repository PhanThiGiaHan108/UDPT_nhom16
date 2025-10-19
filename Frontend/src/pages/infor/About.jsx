import React from "react";

const About = () => (
  <div className="about-page">
    {/* Hero Section */}
    <section className="about-hero">
      <div className="container">
        <div className="about-hero-content">
          <h1>Về chúng tôi</h1>
          <p className="about-hero-subtitle">
            Nền tảng học trực tuyến hàng đầu Việt Nam, mang đến cơ hội học tập
            chất lượng cao cho mọi người, mọi lúc, mọi nơi.
          </p>
        </div>
      </div>
    </section>

    {/* Story Section */}
    <section className="about-story">
      <div className="container">
        <div className="about-story-grid">
          <div className="about-story-image">
            <div className="about-image-placeholder">
              <i className="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div className="about-story-content">
            <h2>Câu chuyện của chúng tôi</h2>
            <p>
              EduLearn được thành lập với sứ mệnh dân chủ hóa giáo dục, giúp mọi
              người dễ dàng tiếp cận kiến thức chất lượng cao từ các chuyên gia
              hàng đầu.
            </p>
            <p>
              Chúng tôi tin rằng giáo dục là chìa khóa để mở ra cơ hội, thay đổi
              cuộc sống và tạo dựng tương lai tốt đẹp hơn. Với công nghệ hiện
              đại và phương pháp giảng dạy tiên tiến, chúng tôi cam kết mang đến
              trải nghiệm học tập tốt nhất.
            </p>
            <div className="about-stats-inline">
              <div className="stat-inline-item">
                <strong>10,000+</strong>
                <span>Học viên</span>
              </div>
              <div className="stat-inline-item">
                <strong>500+</strong>
                <span>Khóa học</span>
              </div>
              <div className="stat-inline-item">
                <strong>100+</strong>
                <span>Giảng viên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="about-mission">
      <div className="container">
        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <h3>Sứ mệnh</h3>
            <p>
              Dân chủ hóa giáo dục, mang kiến thức chất lượng cao đến với mọi
              người, không phân biệt địa lý hay hoàn cảnh, giúp mọi người phát
              triển kỹ năng và đạt được mục tiêu nghề nghiệp.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon">
              <i className="fas fa-eye"></i>
            </div>
            <h3>Tầm nhìn</h3>
            <p>
              Trở thành nền tảng học trực tuyến hàng đầu Việt Nam, nơi kết nối
              hàng triệu học viên với các chuyên gia, tạo ra cộng đồng học tập
              năng động và góp phần phát triển nguồn nhân lực chất lượng cao.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="about-values">
      <div className="container">
        <div className="section-header">
          <h2>Giá trị cốt lõi</h2>
          <p>Những giá trị định hướng mọi hoạt động của chúng tôi</p>
        </div>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-star"></i>
            </div>
            <h4>Chất lượng</h4>
            <p>
              Cam kết mang đến nội dung và trải nghiệm học tập chất lượng cao
              nhất
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h4>Tận tâm</h4>
            <p>Luôn lắng nghe và đặt lợi ích của học viên lên hàng đầu</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h4>Đổi mới</h4>
            <p>
              Không ngừng cải tiến và ứng dụng công nghệ để nâng cao trải nghiệm
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-users"></i>
            </div>
            <h4>Cộng đồng</h4>
            <p>Xây dựng môi trường học tập gắn kết và hỗ trợ lẫn nhau</p>
          </div>
        </div>
      </div>
    </section>

    {/* Team Section */}
    <section className="about-team">
      <div className="container">
        <div className="section-header">
          <h2>Đội ngũ của chúng tôi</h2>
          <p>Những người tạo nên EduLearn</p>
        </div>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h4>Nguyễn Văn A</h4>
            <p className="team-role">CEO & Founder</p>
            <p className="team-bio">
              10+ năm kinh nghiệm trong lĩnh vực giáo dục và công nghệ
            </p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h4>Trần Thị B</h4>
            <p className="team-role">CTO</p>
            <p className="team-bio">
              Chuyên gia về AI và Machine Learning trong giáo dục
            </p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h4>Lê Văn C</h4>
            <p className="team-role">Head of Content</p>
            <p className="team-bio">
              Chuyên gia phát triển nội dung học tập chất lượng cao
            </p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h4>Phạm Thị D</h4>
            <p className="team-role">Head of Marketing</p>
            <p className="team-bio">
              8 năm kinh nghiệm trong marketing và phát triển thương hiệu
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="about-cta">
      <div className="container">
        <div className="about-cta-content">
          <h2>Sẵn sàng bắt đầu hành trình học tập?</h2>
          <p>
            Tham gia cùng hàng ngàn học viên đang học tập và phát triển mỗi ngày
          </p>
          <div className="about-cta-buttons">
            <a href="/courses" className="btn btn-primary btn-large">
              <i className="fas fa-book"></i> Khám phá khóa học
            </a>
            <a href="/contact" className="btn btn-outline-dark btn-large">
              <i className="fas fa-envelope"></i> Liên hệ với chúng tôi
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
