import express from "express";
import {
  getCourses,
  createCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
} from "../controllers/course_controller.js";

const router = express.Router();

// Lấy danh sách khóa học
router.get("/", getCourses);
// Thêm mới khóa học
router.post("/", createCourse);
// Lấy chi tiết 1 khóa học
router.get("/:id", getCourseById);
// Xóa khóa học
router.delete("/:id", deleteCourse);
// Cập nhật khóa học
router.put("/:id", updateCourse);

export default router;
