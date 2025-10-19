import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import courseRoutes from "./routes/course_routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Course DB connected"))
  .catch((err) => console.error("❌ Course DB error:", err));

// Health check
app.get("/api/courses/ping", (req, res) => {
  res.json({ message: "📘 Course Service is running!" });
});

// Route cho courses
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`📘 Course Service running on port ${PORT}`)
);
