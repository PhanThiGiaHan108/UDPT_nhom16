import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route test
app.get("/api/courses/ping", (req, res) => {
  res.json({ message: "📘 Course Service is running!" });
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Course DB connected"))
  .catch((err) => console.error("❌ Course DB error:", err));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`📘 Course Service running on port ${PORT}`)
);
