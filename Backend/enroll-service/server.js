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
app.get("/api/enroll/ping", (req, res) => {
  res.json({ message: "🎓 Enroll Service is running!" });
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Enroll DB connected"))
  .catch((err) => console.error("❌ Enroll DB error:", err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () =>
  console.log(`🎓 Enroll Service running on port ${PORT}`)
);
