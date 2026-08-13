import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    examType: {
      type: String,
      enum: ["Mid Term", "Internal", "Final", "Practical"],
      default: "Final"
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },

    maxMarks: {
      type: Number,
      required: true,
      default: 100
    },

    percentage: {
      type: Number,
      default: 0
    },

    grade: {
      type: String,
      default: "F"
    },

    status: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Fail"
    },

    remarks: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate results
resultSchema.index(
  {
    student: 1,
    subject: 1,
    semester: 1,
    examType: 1
  },
  {
    unique: true
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;