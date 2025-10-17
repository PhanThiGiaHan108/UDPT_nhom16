import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"], // Thay bằng domain frontend của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Cho phép gửi cookie/token
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ ok: true, message: "API is running" }));

app.use("/api", router);

export default app;
