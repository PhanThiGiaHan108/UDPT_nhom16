import axios from "axios";

async function testWebhook() {
  try {
    console.log("🧪 Testing webhook handler...\n");

    // 1. Lấy payment gần nhất
    console.log("📍 Getting latest payment...");
    const listRes = await axios.get(
      "http://localhost:5004/api/payment/list-all"
    );

    if (!listRes.data.payments || listRes.data.payments.length === 0) {
      console.log("❌ No payments found! Create a payment first.");
      return;
    }

    const latestPayment = listRes.data.payments[0];
    console.log("✅ Found payment:");
    console.log("   ID:", latestPayment._id);
    console.log("   Transaction ID:", latestPayment.transactionId);
    console.log("   Status:", latestPayment.status);
    console.log("   Amount:", latestPayment.amount);
    console.log("   User ID:", latestPayment.userId);
    console.log("   Course ID:", latestPayment.courseId);

    // Lấy orderCode từ database
    console.log("\n📍 Fetching full payment details to get orderCode...");
    const paymentRes = await axios.get(
      `http://localhost:5004/api/payment/status/${latestPayment.transactionId}`
    );
    console.log("Payment details:", paymentRes.data);

    // Giả lập orderCode (lấy từ createdAt timestamp)
    const orderCode = new Date(latestPayment.createdAt).getTime();
    console.log("   Using orderCode:", orderCode);

    // 2. Test webhook
    console.log("\n📍 Sending webhook request...");
    const webhookPayload = {
      data: {
        orderCode: orderCode,
        amount: latestPayment.amount,
        status: "PAID",
        description: `Test webhook for ${latestPayment.transactionId}`,
      },
    };

    console.log("Webhook payload:", JSON.stringify(webhookPayload, null, 2));

    const webhookRes = await axios.post(
      "http://localhost:5004/api/payment/webhook",
      webhookPayload
    );

    console.log("✅ Webhook response:", webhookRes.data);

    // 3. Kiểm tra enrollment
    console.log("\n📍 Checking enrollments...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const enrollRes = await axios.get(
      `http://localhost:5003/api/enroll?userId=${latestPayment.userId}`
    );

    console.log("✅ Enrollments:", enrollRes.data);

    // 4. Kiểm tra payment status
    console.log("\n📍 Checking updated payment...");
    const updatedListRes = await axios.get(
      "http://localhost:5004/api/payment/list-all"
    );
    const updatedPayment = updatedListRes.data.payments.find(
      (p) => p._id === latestPayment._id
    );

    console.log("✅ Updated payment:");
    console.log("   Status:", updatedPayment.status);
    console.log("   Paid at:", updatedPayment.paidAt || "Not yet");

    console.log("\n✅ TEST COMPLETED!");
  } catch (error) {
    console.error("\n❌ TEST FAILED!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }
  }
}

testWebhook();
