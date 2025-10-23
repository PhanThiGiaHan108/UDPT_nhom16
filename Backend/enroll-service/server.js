import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import Enroll from "./models/Enroll.js"; // ✅ thêm model ghi danh

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Enroll DB connected"))
  .catch((err) => console.error("❌ Enroll DB error:", err));

// ✅ API ghi danh
app.post("/api/enroll", async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;

    console.log("📥 Nhận request ghi danh:", { userId, courseId, status });

    if (!userId || !courseId)
      return res.status(400).json({ message: "Thiếu userId hoặc courseId" });

    const exist = await Enroll.findOne({ userId, courseId });
    if (exist) {
      console.log("⚠️ Đã ghi danh trước đó:", exist._id);
      return res.status(200).json({
        message: "Đã ghi danh trước đó",
        data: exist,
      });
    }

    const newEnroll = await Enroll.create({
      userId,
      courseId,
      status: status || "active",
    });

    console.log("✅ Ghi danh thành công:", newEnroll._id);
    res.status(201).json({ message: "Ghi danh thành công", data: newEnroll });
  } catch (err) {
    console.error("❌ Enroll error:", err.message);
    res.status(500).json({ message: "Lỗi khi ghi danh!" });
  }
});

// ✅ API lấy danh sách khóa học đã đăng ký
app.get("/api/enroll", async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("📥 Lấy danh sách enrollments cho userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    const enrolls = await Enroll.find({ userId }).sort({ createdAt: -1 });

    console.log(`✅ Tìm thấy ${enrolls.length} enrollments`);

    res.status(200).json({
      success: true,
      data: enrolls,
    });
  } catch (err) {
    console.error("❌ Get enrolls error:", err.message);
    res.status(500).json({ message: "Lỗi khi lấy danh sách khóa học!" });
  }
});

// ✅ API kiểm tra enrollment (để check xem user đã đăng ký khóa học chưa)
app.get("/api/enroll/check", async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Thiếu userId hoặc courseId" });
    }

    const enrollment = await Enroll.findOne({ userId, courseId });

    res.status(200).json({
      success: true,
      enrolled: !!enrollment,
      data: enrollment,
    });
  } catch (err) {
    console.error("❌ Check enrollment error:", err.message);
    res.status(500).json({ message: "Lỗi khi kiểm tra ghi danh!" });
  }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () =>
  console.log(`🎓 Enroll Service running on port ${PORT}`)
);
