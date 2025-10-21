import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/edulearn_payment";

async function createEnrollmentFromPayment() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const payments = db.collection("payments");

    // Lấy các payment đã thanh toán nhưng chưa có enrollment
    const paidPayments = await payments
      .find({
        status: "pending",
        userId: { $exists: true },
        courseId: { $exists: true },
      })
      .toArray();

    console.log(`📋 Found ${paidPayments.length} payments to process`);

    for (const payment of paidPayments) {
      console.log(`\n🔄 Processing payment: ${payment._id}`);
      console.log(`   User: ${payment.userId}`);
      console.log(`   Course: ${payment.courseId}`);

      try {
        // Tạo enrollment qua API
        const response = await axios.post("http://localhost:5003/api/enroll", {
          userId: payment.userId.toString(),
          courseId: payment.courseId.toString(),
          status: "active",
        });

        console.log(`   ✅ Enrollment created successfully`);
        console.log(`   Response:`, response.data);
      } catch (err) {
        console.error(
          `   ❌ Error creating enrollment:`,
          err.response?.data || err.message
        );
      }
    }

    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createEnrollmentFromPayment();
