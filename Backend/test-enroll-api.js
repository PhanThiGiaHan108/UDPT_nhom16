import axios from "axios";

async function testEnrollAPI() {
  try {
    const userId = "68f3d1abfcfd574ceac8a6a1";
    const url = `http://localhost:5000/api/enroll?userId=${userId}`;

    console.log("🔍 Testing API:", url);

    const response = await axios.get(url);

    console.log("\n✅ Response Status:", response.status);
    console.log("\n📦 Response Data:");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.data && response.data.data.length > 0) {
      console.log("\n📚 Enrollments found:", response.data.data.length);
      response.data.data.forEach((item, i) => {
        console.log(`\n${i + 1}. Enrollment:`);
        console.log(`   - Course ID: ${item.courseId}`);
        console.log(`   - Status: ${item.status}`);
        console.log(`   - Has course data: ${item.course ? "YES" : "NO"}`);
        if (item.course) {
          console.log(`   - Course title: ${item.course.title}`);
        }
      });
    } else {
      console.log("\n⚠️ No enrollments found");
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testEnrollAPI();
