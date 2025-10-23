import mongoose from "mongoose";
import dotenv from "dotenv";
import Payment from "./models/Payment.js";

dotenv.config();

async function testMongoDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Test tạo payment
    const testPayment = new Payment({
      userId: new mongoose.Types.ObjectId(),
      courseId: new mongoose.Types.ObjectId(),
      amount: 100000,
      paymentMethod: "payos",
      status: "pending",
      transactionId: `TEST${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      paymentDetails: {
        orderCode: Date.now().toString(),
      },
    });

    console.log("💾 Saving test payment...");
    const savedPayment = await testPayment.save();
    console.log("✅ Payment saved successfully!");
    console.log("📄 Payment ID:", savedPayment._id);
    console.log("📄 Payment data:", JSON.stringify(savedPayment, null, 2));

    // Đọc lại payment từ database
    console.log("\n🔍 Reading payment from database...");
    const foundPayment = await Payment.findById(savedPayment._id);
    if (foundPayment) {
      console.log("✅ Payment found in database!");
      console.log("📄 Found payment:", JSON.stringify(foundPayment, null, 2));
    } else {
      console.log("❌ Payment NOT found in database!");
    }

    // Xóa test payment
    await Payment.findByIdAndDelete(savedPayment._id);
    console.log("🗑️ Test payment deleted");

    // Đếm số lượng payments
    const count = await Payment.countDocuments();
    console.log(`\n📊 Total payments in database: ${count}`);

    // Lấy 5 payments gần nhất
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("transactionId status amount createdAt");
    console.log("\n📋 Recent 5 payments:");
    recentPayments.forEach((p, i) => {
      console.log(
        `  ${i + 1}. ${p.transactionId} - ${p.status} - ${p.amount} VND - ${
          p.createdAt
        }`
      );
    });

    mongoose.connection.close();
    console.log("\n✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

testMongoDB();
