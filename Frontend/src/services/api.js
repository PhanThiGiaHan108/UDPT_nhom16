import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ phải là API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
