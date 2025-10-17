import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectMongo } from "../db/mongo.js";
import User from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  try {
    await connectMongo();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    const adminName = process.env.ADMIN_NAME || "Admin";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin account already exists =>", existing.email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: "admin",
    });

    console.log("Created admin account:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin account:", err);
    process.exit(1);
  }
}

seedAdmin();
