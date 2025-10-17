import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (!payload || !payload.id)
      return res.status(401).json({ error: "Invalid token" });

    const user = await User.findById(payload.id).select("role");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "admin")
      return res.status(403).json({ error: "Admin only" });

    // attach user id and role to request for downstream handlers
    req.user = { id: payload.id, role: user.role };
    next();
  } catch (err) {
    console.error("isAdmin error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default isAdmin;
