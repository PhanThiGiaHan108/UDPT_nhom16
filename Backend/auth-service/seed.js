import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Kiểm tra xem admin đã tồn tại chưa
    const adminExists = await User.findOne({ email: "admin@example.com" });
    
    if (adminExists) {
      console.log("⚠️  Admin account already exists!");
      process.exit(0);
    }

    // Tạo tài khoản admin mặc định
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Sẽ được hash tự động bởi pre-save hook
      role: "admin"
    });

    console.log("✅ Admin account created successfully!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Vui lòng đổi mật khẩu sau khi đăng nhập!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
