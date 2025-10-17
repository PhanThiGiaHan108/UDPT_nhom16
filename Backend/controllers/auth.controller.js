import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { firstName, lastName, email, password, password_confirmation } =
      req.body;

    // 1️⃣ Kiểm tra dữ liệu bắt buộc
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !password_confirmation
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2️⃣ Kiểm tra xác nhận mật khẩu
    if (password !== password_confirmation) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // 3️⃣ Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // 4️⃣ Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Tạo user mới
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const user = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: "user", // default role for registrations
    });

    // 6️⃣ Trả về phản hồi thành công
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2️⃣ Tìm người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4️⃣ Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    // 5️⃣ Trả về thông tin đăng nhập thành công
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
