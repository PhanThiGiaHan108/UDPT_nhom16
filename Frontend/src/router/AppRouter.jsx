import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// 🔹 Pages
import Home from "../pages/Home";
import Courses from "../pages/course/Courses";
import CourseDetail from "../pages/course/CourseDetail";
import MyCourses from "../pages/course/MyCourses";
import About from "../pages/infor/About";
import Contact from "../pages/infor/Contact";
import Features from "../pages/infor/Features";
import PaymentPage from "../pages/PaymentPage";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/profile/Settings";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminUsers from "../pages/admin/AdminUsers";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ CÁC TRANG DÙNG LAYOUT */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ❌ CÁC TRANG KHÔNG DÙNG LAYOUT */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <h1>404 - Trang không tồn tại</h1>
              <a href="/" style={{ color: "#007bff" }}>
                Quay về trang chủ
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
