import mongoose from "mongoose";

const enrollSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Enroll", enrollSchema);
