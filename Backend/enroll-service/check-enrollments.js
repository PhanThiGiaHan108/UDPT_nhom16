import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/edulearn_enroll";

async function checkEnrollments() {
  try {
    console.log("🔍 Using MONGO_URI:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", MONGO_URI);

    const db = mongoose.connection.db;

    // Kiểm tra tất cả collections
    const collections = await db.listCollections().toArray();
    console.log("\n📋 All collections in database:");
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    // Kiểm tra cả 2 collections có thể
    const enrolls = db.collection("enrolls");
    const enrollments = db.collection("enrollments");

    // Đếm tổng số enrollment trong mỗi collection
    const enrollsCount = await enrolls.countDocuments();
    const enrollmentsCount = await enrollments.countDocuments();

    console.log(`\n📊 Collection "enrolls": ${enrollsCount} documents`);
    console.log(`📊 Collection "enrollments": ${enrollmentsCount} documents`);

    console.log(`\n📊 Collection "enrolls": ${enrollsCount} documents`);
    console.log(`📊 Collection "enrollments": ${enrollmentsCount} documents`);

    // Lấy tất cả enrollments từ collection có data
    const targetCollection = enrollsCount > 0 ? enrolls : enrollments;
    const collectionName = enrollsCount > 0 ? "enrolls" : "enrollments";

    console.log(`\n📋 All data from "${collectionName}" collection:`);
    const allEnrollments = await targetCollection.find({}).toArray();

    console.log("\n📋 All enrollments:");
    allEnrollments.forEach((e, i) => {
      console.log(`\n${i + 1}. Enrollment ID: ${e._id}`);
      console.log(`   User ID: ${e.userId}`);
      console.log(`   Course ID: ${e.courseId}`);
      console.log(`   Status: ${e.status}`);
      console.log(`   Created: ${e.createdAt}`);
    });

    // Kiểm tra user cụ thể
    const userId = "68f3d1abfcfd574ceac8a6a1";
    const userEnrollments = await targetCollection.find({ userId }).toArray();
    console.log(
      `\n🔍 Enrollments for user ${userId}: ${userEnrollments.length}`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkEnrollments();
