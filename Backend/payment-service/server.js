import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import paymentRoutes from "./routes/payment_routes.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from current directory
dotenv.config({ path: join(__dirname, ".env") });

// ✅ Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

console.log("🔑 Environment check:");
console.log(
  "  PAYOS_CLIENT_ID:",
  process.env.PAYOS_CLIENT_ID ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "  PAYOS_API_KEY:",
  process.env.PAYOS_API_KEY ? "✅ Loaded" : "❌ Missing"
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "💳 Payment Service (PayOS) is running!" });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () =>
  console.log(`💳 Payment Service running on port ${PORT}`)
);
