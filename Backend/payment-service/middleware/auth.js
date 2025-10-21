import jwt from "jsonwebtoken";

/**
 * Middleware xác thực JWT token
 */
export function authenticateToken(req, res, next) {
  try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log("🔑 Auth Header:", authHeader);
    console.log("🔑 Token:", token);
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token. Vui lòng đăng nhập!",
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("❌ JWT Verify Error:", err.message);
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn!",
        });
      }

      // Lưu thông tin user vào request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
      error: error.message,
    });
  }
}

/**
 * Middleware để capture raw body (cần cho webhook signature verification)
 */
export function captureRawBody(req, res, next) {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    req.rawBody = data;
    next();
  });
}
