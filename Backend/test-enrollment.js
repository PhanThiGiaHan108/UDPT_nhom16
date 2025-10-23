import axios from "axios";

async function testEnrollmentFlow() {
  try {
    console.log("🧪 TESTING ENROLLMENT FLOW\n");
    console.log("=".repeat(60));

    // IDs từ hệ thống
    const TEST_USER_ID = "68f3d1abfcfd574ceac8a6a1";
    const TEST_COURSE_ID = "68f7388b657fad0a73dbb9b9";

    // 1. Kiểm tra enroll service
    console.log("\n📍 STEP 1: Checking Enroll Service...");
    try {
      const testRes = await axios.get("http://localhost:5003/api/enroll", {
        params: { userId: TEST_USER_ID },
      });
      console.log("✅ Enroll service is working!");
      console.log(`   Current enrollments: ${testRes.data.data?.length || 0}`);
    } catch (err) {
      console.log("❌ Enroll service is not running!");
      console.log(
        "   Please start: cd Backend/enroll-service && node server.js"
      );
      return;
    }

    // 2. Tạo enrollment trực tiếp
    console.log("\n📍 STEP 2: Creating enrollment directly...");
    const enrollRes = await axios.post("http://localhost:5003/api/enroll", {
      userId: TEST_USER_ID,
      courseId: TEST_COURSE_ID,
      status: "active",
    });

    console.log("✅ Enrollment created!");
    console.log("   Enrollment ID:", enrollRes.data.data._id);
    console.log("   User ID:", enrollRes.data.data.userId);
    console.log("   Course ID:", enrollRes.data.data.courseId);
    console.log("   Status:", enrollRes.data.data.status);

    // 3. Kiểm tra lại enrollments
    console.log("\n📍 STEP 3: Verifying enrollment...");
    const checkRes = await axios.get("http://localhost:5003/api/enroll", {
      params: { userId: TEST_USER_ID },
    });

    console.log(`✅ User now has ${checkRes.data.data.length} enrollment(s)!`);
    checkRes.data.data.forEach((enroll, i) => {
      console.log(
        `   ${i + 1}. Course: ${enroll.courseId} - Status: ${enroll.status}`
      );
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ TEST COMPLETED!");
    console.log("\n💡 Bây giờ refresh trang 'My Courses' để xem kết quả!");
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

testEnrollmentFlow();
