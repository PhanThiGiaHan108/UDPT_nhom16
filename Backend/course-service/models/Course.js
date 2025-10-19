import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    students: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    icon: { type: String },
    instructor: { type: String },
    level: { type: String },
    // Extra fields for detail page content
    lectures: { type: Number, default: 0 },
    assignments: { type: Number, default: 0 },
    certificate: { type: Boolean, default: false },
    fullDescription: { type: String },
    learningOutcomes: [{ type: String }],
    requirements: [{ type: String }],
    previewVideo: { type: String }, // Video giới thiệu khóa học (YouTube/mp4)
    includes: [
      {
        icon: { type: String },
        text: { type: String, required: true },
      },
    ],
    curriculum: [
      {
        section: String,
        lectures: { type: Number, default: 0 },
        duration: String,
        lessons: [
          {
            title: String,
            duration: String,
            free: { type: Boolean, default: false },
            videoUrl: String,
          },
        ],
      },
    ],
    instructorTitle: { type: String },
    instructorBio: { type: String },
    reviews: [
      {
        name: String,
        rating: Number,
        date: String,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
