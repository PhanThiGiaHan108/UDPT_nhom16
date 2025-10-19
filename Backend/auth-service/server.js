import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth_routes.js";

// ✅ Nạp biến môi trường trước khi dùng
dotenv.config();

// ✅ Khởi tạo app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Auth DB connected"))
  .catch((err) => console.error("❌ Auth DB error:", err));

// ✅ Sử dụng router
app.use("/api/auth", authRoutes);

// ✅ Route kiểm tra nhanh
app.get("/", (req, res) => {
  res.json({ message: "👤 Auth Service is running!" });
});

// ✅ Khởi chạy server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`👤 Auth Service running on port ${PORT}`));
