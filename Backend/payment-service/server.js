import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route test
app.get("/api/payment/ping", (req, res) => {
  res.json({ message: "💳 Payment Service is running!" });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () =>
  console.log(`💳 Payment Service running on port ${PORT}`)
);
