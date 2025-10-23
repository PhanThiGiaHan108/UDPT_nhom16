import axios from "axios";

async function testCreatePayment() {
  try {
    console.log("🧪 Testing payment creation...\n");

    const paymentData = {
      userId: "68f3d1abfcfd574ceac8a6a1", // Test user ID
      courseId: "68f7388b657fad0a73dbb9b9", // Test course ID
      amount: 150000,
    };

    console.log("📤 Sending request to create payment link...");
    console.log("📦 Data:", JSON.stringify(paymentData, null, 2));

    const response = await axios.post(
      "http://localhost:5004/api/payment/create-link",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\n✅ Response received:");
    console.log(JSON.stringify(response.data, null, 2));

    // Đợi 2 giây rồi kiểm tra database
    console.log("\n⏳ Waiting 2 seconds before checking database...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("\n🔍 Checking payments in database...");
    const listResponse = await axios.get(
      "http://localhost:5004/api/payment/list-all"
    );

    console.log("\n📊 Database status:");
    console.log(`Total payments: ${listResponse.data.total}`);
    console.log(`Recent payments: ${listResponse.data.showing}\n`);

    if (listResponse.data.payments && listResponse.data.payments.length > 0) {
      console.log("📋 Recent payments:");
      listResponse.data.payments.forEach((p, i) => {
        console.log(`  ${i + 1}. ID: ${p._id}`);
        console.log(`     Transaction: ${p.transactionId}`);
        console.log(`     Status: ${p.status}`);
        console.log(`     Amount: ${p.amount} VND`);
        console.log(`     Created: ${p.createdAt}\n`);
      });
    }

    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("\n❌ Error occurred:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
}

testCreatePayment();
