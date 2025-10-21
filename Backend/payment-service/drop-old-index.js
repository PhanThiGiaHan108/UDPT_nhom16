import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/edulearn_payment";

async function dropOldIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("payments");

    // Drop the old orderId_1 index
    try {
      await collection.dropIndex("orderId_1");
      console.log("✅ Dropped orderId_1 index successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log(
          "ℹ️  orderId_1 index doesn't exist (already dropped or never created)"
        );
      } else {
        throw err;
      }
    }

    // List remaining indexes
    const indexes = await collection.indexes();
    console.log("📋 Remaining indexes:", JSON.stringify(indexes, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

dropOldIndex();
