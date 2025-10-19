import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ AUTH SERVICE proxy chuẩn
app.use(
  "/api/auth",
  proxy("http://localhost:5001", {
    proxyReqPathResolver: (req) => {
      return req.originalUrl; // giữ nguyên /api/auth/*
    },
  })
);

// ✅ COURSE SERVICE (port 5002)
app.use(
  "/api/courses",
  proxy("http://localhost:5002", {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/courses", ""),
  })
);

// ✅ ENROLL SERVICE (port 5003)
app.use(
  "/api/enroll",
  proxy("http://localhost:5003", {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/enroll", ""),
  })
);

// ✅ PAYMENT SERVICE (port 5004)
app.use(
  "/api/payment",
  proxy("http://localhost:5004", {
    proxyReqPathResolver: (req) => req.originalUrl.replace("/api/payment", ""),
  })
);

// ✅ Kiểm tra trạng thái Gateway
app.get("/", (req, res) => {
  res.json({ message: "🌐 API Gateway is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Gateway running on port ${PORT}`));
