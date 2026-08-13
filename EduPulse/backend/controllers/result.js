import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import generateResultPDF from "../utils/generatePDF.js";

import {
  calculatePercentage,
  calculateGrade,
  calculateStatus
} from "../utils/gradeCalculator.js";


// =========================
// CREATE RESULT
// POST /api/results
// =========================
export const createResult = async (req, res) => {
  try {
    const {
      student,
      subject,
      semester,
      examType,
      marksObtained,
      maxMarks,
      remarks
    } = req.body;

    if (
      !student ||
      !subject ||
      !semester ||
      marksObtained === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "student, subject, semester and marksObtained are required"
      });
    }

    // Check student
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Check subject
    const existingSubject = await Subject.findById(subject);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const finalMaxMarks =
      maxMarks || existingSubject.maxMarks || 100;

    if (marksObtained > finalMaxMarks) {
      return res.status(400).json({
        success: false,
        message: "Marks obtained cannot exceed maximum marks"
      });
    }

    // Calculate result
    const percentage = calculatePercentage(
      marksObtained,
      finalMaxMarks
    );

    const grade = calculateGrade(percentage);

    const status = calculateStatus(percentage);

    const result = await Result.create({
      student,
      subject,
      semester,
      examType,
      marksObtained,
      maxMarks: finalMaxMarks,
      percentage,
      grade,
      status,
      remarks
    });

    const populatedResult = await Result.findById(
      result._id
    )
      .populate("student", "studentId name email department")
      .populate("subject", "subjectId name code credits");

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      result: populatedResult
    });
  } catch (error) {
    console.error("Create result error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET ALL RESULTS
// GET /api/results
// =========================
export const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate(
        "student",
        "studentId name email department course"
      )
      .populate(
        "subject",
        "subjectId name code credits"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error("Get results error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET RESULT BY ID
// GET /api/results/:id
// =========================
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate(
        "student",
        "studentId name email department course"
      )
      .populate(
        "subject",
        "subjectId name code credits"
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error("Get result error:", error.message);

    res.status(400).json({
      success: false,
      message: "Invalid result ID"
    });
  }
};


// =========================
// UPDATE RESULT
// PUT /api/results/:id
// =========================
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    const {
      student,
      subject,
      semester,
      examType,
      marksObtained,
      maxMarks,
      remarks
    } = req.body;

    if (student !== undefined) {
      const studentExists = await Student.findById(student);

      if (!studentExists) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      result.student = student;
    }

    if (subject !== undefined) {
      const subjectExists = await Subject.findById(subject);

      if (!subjectExists) {
        return res.status(404).json({
          success: false,
          message: "Subject not found"
        });
      }

      result.subject = subject;
    }

    if (semester !== undefined) {
      result.semester = semester;
    }

    if (examType !== undefined) {
      result.examType = examType;
    }

    if (marksObtained !== undefined) {
      result.marksObtained = marksObtained;
    }

    if (maxMarks !== undefined) {
      result.maxMarks = maxMarks;
    }

    if (remarks !== undefined) {
      result.remarks = remarks;
    }

    if (result.marksObtained > result.maxMarks) {
      return res.status(400).json({
        success: false,
        message: "Marks obtained cannot exceed maximum marks"
      });
    }

    // Recalculate
    result.percentage = calculatePercentage(
      result.marksObtained,
      result.maxMarks
    );

    result.grade = calculateGrade(
      result.percentage
    );

    result.status = calculateStatus(
      result.percentage
    );

    await result.save();

    const updatedResult = await Result.findById(
      result._id
    )
      .populate(
        "student",
        "studentId name email department"
      )
      .populate(
        "subject",
        "subjectId name code credits"
      );

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      result: updatedResult
    });
  } catch (error) {
    console.error("Update result error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// DELETE RESULT
// DELETE /api/results/:id
// =========================
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    await Result.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Result deleted successfully"
    });
  } catch (error) {
    console.error("Delete result error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// =========================
// GENERATE STUDENT RESULT PDF
// GET /api/results/student/:studentId/pdf
// =========================

export const generateStudentResultPDF = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Find student's results
    const results = await Result.find({
      student: studentId
    })
      .populate(
        "subject",
        "subjectId name code credits"
      )
      .sort({
        semester: 1
      });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found for this student"
      });
    }

    // Calculate total marks
    const totalMarks = results.reduce(
      (total, result) => {
        return total + result.marksObtained;
      },
      0
    );

    // Calculate maximum marks
    const totalMaxMarks = results.reduce(
      (total, result) => {
        return total + result.maxMarks;
      },
      0
    );

    // Calculate percentage
    const overallPercentage =
      totalMaxMarks > 0
        ? Number(
            (
              (totalMarks / totalMaxMarks) *
              100
            ).toFixed(2)
          )
        : 0;

    // Count passed subjects
    const passedSubjects = results.filter(
      (result) => result.status === "Pass"
    ).length;

    // Count failed subjects
    const failedSubjects = results.filter(
      (result) => result.status === "Fail"
    ).length;

    // Performance object
    const performance = {
      totalSubjects: results.length,
      totalMarks,
      totalMaxMarks,
      overallPercentage,
      passedSubjects,
      failedSubjects
    };

    // Generate PDF
    generateResultPDF(
      student,
      results,
      performance,
      res
    );

  } catch (error) {
    console.error(
      "Generate PDF error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate PDF"
    });
  }
};