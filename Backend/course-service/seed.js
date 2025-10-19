import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";

dotenv.config();

const videoUrls = [
  "https://youtu.be/dZsYIXpGs-A?si=2BRvZshUlu8U4TE3",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
  "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  "https://www.youtube.com/watch?v=ktvTqknDobU",
  "https://www.youtube.com/watch?v=9bZkp7q19f0",
];
const seedCourses = [
  {
    title: "Lập trình Web từ cơ bản đến nâng cao",
    description: "Khóa học đầy đủ về HTML, CSS, JavaScript và React",
    category: "Web Development",
    price: 1500000,
    duration: "40 giờ",
    students: 234,
    rating: 4.8,
    icon: "fas fa-code",
    instructor: "Nguyễn Văn A",
    level: "Beginner",
    lectures: 120,
    assignments: 12,
    certificate: true,
    fullDescription:
      "Khóa học bao quát từ nền tảng đến nâng cao về phát triển web.",
    learningOutcomes: [
      "Thành thạo HTML, CSS",
      "Sử dụng JavaScript hiện đại",
      "Xây dựng SPA với React",
    ],
    requirements: ["Máy tính kết nối Internet", "Kiến thức cơ bản về máy tính"],
    previewVideo: videoUrls[0], // Video giới thiệu khóa học
    includes: [
      { icon: "fas fa-play-circle", text: "120 bài giảng" },
      { icon: "fas fa-tasks", text: "12 bài tập" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
      { icon: "fas fa-headset", text: "Hỗ trợ trực tuyến" },
    ],
    curriculum: [
      {
        section: "Giới thiệu",
        lectures: 5,
        duration: "1 giờ",
        lessons: [
          {
            title: "Tổng quan khóa học",
            duration: "10:00",
            free: true,
            videoUrl: videoUrls[0],
          },
          {
            title: "Cài đặt môi trường",
            duration: "15:00",
            videoUrl: videoUrls[0],
          },
        ],
      },
      {
        section: "HTML & CSS",
        lectures: 20,
        duration: "6 giờ",
        lessons: [
          { title: "HTML cơ bản", duration: "20:00", videoUrl: videoUrls[0] },
          { title: "CSS Flexbox", duration: "25:00", videoUrl: videoUrls[0] },
        ],
      },
    ],
    instructorTitle: "Senior Frontend Engineer",
    instructorBio: "10+ năm kinh nghiệm phát triển web.",
    reviews: [
      {
        name: "Học viên 1",
        rating: 5,
        date: "2025-10-01",
        comment: "Khóa học rất hay!",
      },
      {
        name: "Học viên 2",
        rating: 4,
        date: "2025-10-10",
        comment: "Nội dung đầy đủ, dễ hiểu.",
      },
    ],
  },
  {
    title: "Node.js & Express - Backend Development",
    description: "Xây dựng API RESTful với Node.js và Express",
    category: "Backend",
    price: 1800000,
    duration: "35 giờ",
    students: 187,
    rating: 4.9,
    icon: "fab fa-node-js",
    instructor: "Trần Thị B",
    level: "Intermediate",
    lectures: 90,
    assignments: 10,
    certificate: true,
    fullDescription: "Xây dựng backend hiện đại với Node.js.",
    learningOutcomes: ["REST API", "Middleware", "Auth & JWT"],
    requirements: ["JavaScript cơ bản"],
    previewVideo: videoUrls[1],
    includes: [
      { icon: "fas fa-play-circle", text: "90 bài giảng" },
      { icon: "fas fa-tasks", text: "10 bài tập" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
      { icon: "fas fa-headset", text: "Hỗ trợ trực tuyến" },
    ],
    curriculum: [
      {
        section: "Khởi động",
        lectures: 8,
        duration: "2 giờ",
        lessons: [
          {
            title: "Node.js là gì?",
            duration: "12:00",
            free: true,
            videoUrl: videoUrls[1],
          },
          {
            title: "Cài đặt Node.js",
            duration: "15:00",
            videoUrl: videoUrls[1],
          },
        ],
      },
    ],
    instructorTitle: "Backend Engineer",
    instructorBio: "Chuyên Node.js & MongoDB.",
    reviews: [
      {
        name: "Bạn C",
        rating: 5,
        date: "2025-10-05",
        comment: "Thực tế và hữu ích.",
      },
    ],
  },
  {
    title: "React Advanced - State Management",
    description: "Quản lý state với Redux, Context API và React Query",
    category: "Frontend",
    price: 2000000,
    duration: "30 giờ",
    students: 156,
    rating: 4.7,
    icon: "fab fa-react",
    instructor: "Lê Văn C",
    level: "Advanced",
    lectures: 70,
    assignments: 8,
    fullDescription: "Chuyên sâu quản lý state trong React.",
    learningOutcomes: ["Redux Toolkit", "Context nâng cao", "React Query"],
    previewVideo: videoUrls[2],
    includes: [
      { icon: "fas fa-play-circle", text: "70 bài giảng" },
      { icon: "fas fa-tasks", text: "8 bài tập" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
      { icon: "fas fa-headset", text: "Hỗ trợ trực tuyến" },
    ],
    curriculum: [
      {
        section: "Giới thiệu Redux",
        lectures: 3,
        duration: "1 giờ",
        lessons: [
          { title: "Redux là gì?", duration: "15:00", videoUrl: videoUrls[2] },
          { title: "Cài đặt Redux", duration: "20:00", videoUrl: videoUrls[2] },
        ],
      },
      {
        section: "Context API",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          {
            title: "Context cơ bản",
            duration: "20:00",
            videoUrl: videoUrls[2],
          },
          {
            title: "Context nâng cao",
            duration: "20:00",
            videoUrl: videoUrls[2],
          },
        ],
      },
    ],
    instructorTitle: "React Specialist",
    instructorBio: "Đam mê kiến trúc front-end.",
  },
  {
    title: "MongoDB - Database NoSQL",
    description: "Làm chủ MongoDB từ cơ bản đến nâng cao",
    category: "Database",
    price: 1200000,
    duration: "25 giờ",
    students: 203,
    rating: 4.6,
    icon: "fas fa-database",
    instructor: "Phạm Thị D",
    level: "Beginner",
    fullDescription: "NoSQL và MongoDB thực chiến.",
    learningOutcomes: ["Schema design", "Aggregation", "Indexing"],
    previewVideo: videoUrls[3],
    includes: [
      { icon: "fas fa-play-circle", text: "40+ bài giảng" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
    ],
    curriculum: [
      {
        section: "Giới thiệu MongoDB",
        lectures: 2,
        duration: "30 phút",
        lessons: [
          {
            title: "MongoDB là gì?",
            duration: "15:00",
            videoUrl: videoUrls[3],
          },
          {
            title: "Cài đặt MongoDB",
            duration: "15:00",
            videoUrl: videoUrls[3],
          },
        ],
      },
      {
        section: "Aggregation",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          {
            title: "Pipeline cơ bản",
            duration: "20:00",
            videoUrl: videoUrls[3],
          },
          {
            title: "Pipeline nâng cao",
            duration: "20:00",
            videoUrl: videoUrls[3],
          },
        ],
      },
    ],
  },
  {
    title: "Docker & Kubernetes",
    description: "Container hóa ứng dụng và triển khai với K8s",
    category: "DevOps",
    price: 2500000,
    duration: "45 giờ",
    students: 98,
    rating: 4.9,
    icon: "fab fa-docker",
    instructor: "Hoàng Văn E",
    level: "Advanced",
    fullDescription: "Triển khai hiện đại với container & k8s.",
    learningOutcomes: ["Dockerfile", "K8s deployment"],
    previewVideo: videoUrls[4],
    includes: [
      { icon: "fas fa-play-circle", text: "45+ bài giảng" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
    ],
    curriculum: [
      {
        section: "Giới thiệu Docker",
        lectures: 2,
        duration: "30 phút",
        lessons: [
          { title: "Docker là gì?", duration: "15:00", videoUrl: videoUrls[4] },
          {
            title: "Cài đặt Docker",
            duration: "15:00",
            videoUrl: videoUrls[4],
          },
        ],
      },
      {
        section: "Kubernetes",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          { title: "K8s cơ bản", duration: "20:00", videoUrl: videoUrls[4] },
          {
            title: "Triển khai với K8s",
            duration: "20:00",
            videoUrl: videoUrls[4],
          },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science",
    description: "Phân tích dữ liệu với Python, Pandas và NumPy",
    category: "Data Science",
    price: 2200000,
    duration: "50 giờ",
    students: 312,
    rating: 4.8,
    icon: "fab fa-python",
    instructor: "Đỗ Thị F",
    level: "Intermediate",
    fullDescription: "Phân tích dữ liệu từ A-Z.",
    learningOutcomes: ["Pandas", "NumPy", "Visualization"],
    previewVideo: videoUrls[5],
    includes: [
      { icon: "fas fa-play-circle", text: "50+ bài giảng" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
    ],
    curriculum: [
      {
        section: "Giới thiệu Python",
        lectures: 2,
        duration: "30 phút",
        lessons: [
          { title: "Python là gì?", duration: "15:00", videoUrl: videoUrls[5] },
          {
            title: "Cài đặt Python",
            duration: "15:00",
            videoUrl: videoUrls[5],
          },
        ],
      },
      {
        section: "Pandas & NumPy",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          { title: "Pandas cơ bản", duration: "20:00", videoUrl: videoUrls[5] },
          {
            title: "NumPy nâng cao",
            duration: "20:00",
            videoUrl: videoUrls[5],
          },
        ],
      },
    ],
  },
  {
    title: "UI/UX Design với Figma",
    description: "Thiết kế giao diện đẹp và trải nghiệm người dùng tốt",
    category: "Design",
    price: 1600000,
    duration: "28 giờ",
    students: 245,
    rating: 4.7,
    icon: "fas fa-palette",
    instructor: "Vũ Văn G",
    level: "Beginner",
    fullDescription: "Thiết kế UI/UX chuyên nghiệp.",
    learningOutcomes: ["Wireframe", "Prototype"],
    previewVideo: videoUrls[6],
    includes: [
      { icon: "fas fa-play-circle", text: "28+ giờ nội dung" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
    ],
    curriculum: [
      {
        section: "Giới thiệu Figma",
        lectures: 2,
        duration: "30 phút",
        lessons: [
          { title: "Figma là gì?", duration: "15:00", videoUrl: videoUrls[6] },
          { title: "Cài đặt Figma", duration: "15:00", videoUrl: videoUrls[6] },
        ],
      },
      {
        section: "Thiết kế UI/UX",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          {
            title: "Wireframe cơ bản",
            duration: "20:00",
            videoUrl: videoUrls[6],
          },
          {
            title: "Prototype nâng cao",
            duration: "20:00",
            videoUrl: videoUrls[6],
          },
        ],
      },
    ],
  },
  {
    title: "TypeScript Fundamentals",
    description: "JavaScript với type safety cho dự án lớn",
    category: "Programming",
    price: 1400000,
    duration: "20 giờ",
    students: 178,
    rating: 4.6,
    icon: "fas fa-file-code",
    instructor: "Bùi Thị H",
    level: "Intermediate",
    fullDescription: "TypeScript cho dự án quy mô.",
    learningOutcomes: ["Types cơ bản", "Generics"],
    previewVideo: videoUrls[7],
    includes: [
      { icon: "fas fa-play-circle", text: "20+ giờ nội dung" },
      { icon: "fas fa-infinity", text: "Truy cập trọn đời" },
      { icon: "fas fa-mobile-alt", text: "Học trên mọi thiết bị" },
    ],
    curriculum: [
      {
        section: "Giới thiệu TypeScript",
        lectures: 2,
        duration: "30 phút",
        lessons: [
          {
            title: "TypeScript là gì?",
            duration: "15:00",
            videoUrl: videoUrls[7],
          },
          {
            title: "Cài đặt TypeScript",
            duration: "15:00",
            videoUrl: videoUrls[7],
          },
        ],
      },
      {
        section: "Types & Generics",
        lectures: 2,
        duration: "40 phút",
        lessons: [
          { title: "Types cơ bản", duration: "20:00", videoUrl: videoUrls[7] },
          {
            title: "Generics nâng cao",
            duration: "20:00",
            videoUrl: videoUrls[7],
          },
        ],
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    await Course.deleteMany({});
    console.log("🗑️  Cleared old courses");
    await Course.insertMany(seedCourses);
    console.log("🌱 Seeded courses successfully!");
    mongoose.connection.close();
    console.log("👋 Database connection closed");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedDB();
