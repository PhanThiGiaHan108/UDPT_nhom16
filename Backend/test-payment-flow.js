import axios from "axios";

/**
 * Script test toàn bộ flow thanh toán và ghi danh
 */

const TEST_USER_ID = "68f3d1abfcfd574ceac8a6a1";
const TEST_COURSE_ID = "68f7388b657fad0a73dbb9b9";

async function testPaymentFlow() {
  console.log("🧪 TESTING PAYMENT & ENROLLMENT FLOW\n");
  console.log("=".repeat(60));

  try {
    // 1. Tạo payment
    console.log("\n📍 STEP 1: Creating payment...");
    const paymentRes = await axios.post(
      "http://localhost:5004/api/payment/create-link",
      {
        userId: TEST_USER_ID,
        courseId: TEST_COURSE_ID,
        amount: 150000,
      }
    );

    console.log("✅ Payment created!");
    console.log("   Payment ID:", paymentRes.data.paymentId);
    console.log("   Transaction ID:", paymentRes.data.transactionId);
    console.log("   Order Code:", paymentRes.data.orderCode);

    const paymentId = paymentRes.data.paymentId;
    const orderCode = paymentRes.data.orderCode;

    // 2. Kiểm tra payment trong database
    console.log("\n📍 STEP 2: Checking payment in database...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const listRes = await axios.get(
      "http://localhost:5004/api/payment/list-all"
    );
    const payment = listRes.data.payments.find((p) => p._id === paymentId);

    if (payment) {
      console.log("✅ Payment found in database!");
      console.log("   Status:", payment.status);
      console.log("   Amount:", payment.amount);
    } else {
      console.log("❌ Payment NOT found in database!");
    }

    // 3. Simulate webhook (thanh toán thành công)
    console.log("\n📍 STEP 3: Simulating PayOS webhook (payment success)...");
    const webhookRes = await axios.post(
      "http://localhost:5004/api/payment/webhook",
      {
        data: {
          orderCode: parseInt(orderCode),
          amount: 150000,
          status: "PAID",
          description: `U${TEST_USER_ID.slice(-10)}C${TEST_COURSE_ID.slice(
            -10
          )}`,
        },
      }
    );

    console.log("✅ Webhook processed!");
    console.log("   Response:", webhookRes.data);

    // 4. Kiểm tra enrollment đã được tạo chưa
    console.log("\n📍 STEP 4: Checking enrollment...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const enrollRes = await axios.get(
      `http://localhost:5003/api/enroll?userId=${TEST_USER_ID}`
    );

    console.log("✅ Enrollments retrieved!");
    console.log("   Total enrollments:", enrollRes.data.data?.length || 0);

    if (enrollRes.data.data && enrollRes.data.data.length > 0) {
      enrollRes.data.data.forEach((enroll, i) => {
        console.log(`\n   Enrollment ${i + 1}:`);
        console.log("      ID:", enroll._id);
        console.log("      Course ID:", enroll.courseId);
        console.log("      Status:", enroll.status);
        console.log(
          "      Created:",
          new Date(enroll.createdAt).toLocaleString()
        );
      });
    } else {
      console.log("   ⚠️ No enrollments found!");
    }

    // 5. Kiểm tra payment status đã update chưa
    console.log("\n📍 STEP 5: Checking updated payment status...");
    const updatedListRes = await axios.get(
      "http://localhost:5004/api/payment/list-all"
    );
    const updatedPayment = updatedListRes.data.payments.find(
      (p) => p._id === paymentId
    );

    if (updatedPayment) {
      console.log("✅ Payment status:");
      console.log("   Status:", updatedPayment.status);
      console.log("   Paid at:", updatedPayment.paidAt || "Not yet");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ TEST COMPLETED SUCCESSFULLY!\n");
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

testPaymentFlow();
