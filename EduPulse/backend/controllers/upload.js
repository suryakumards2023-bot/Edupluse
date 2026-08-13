import XLSX from "xlsx";
import fs from "fs";

import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Result from "../models/Result.js";

import {
  calculatePercentage,
  calculateGrade,
  calculateStatus
} from "../utils/gradeCalculator.js";


// =========================
// UPLOAD RESULT EXCEL
// POST /api/upload/results
// =========================
export const uploadResults = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file"
      });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel to JSON
    const rows = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Excel file is empty"
      });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        const {
          studentId,
          subjectCode,
          semester,
          examType,
          marksObtained,
          maxMarks,
          remarks
        } = row;

        // Validate required fields
        if (
          !studentId ||
          !subjectCode ||
          !semester ||
          marksObtained === undefined
        ) {
          errors.push({
            row: i + 2,
            message:
              "studentId, subjectCode, semester and marksObtained are required"
          });

          continue;
        }

        // Find student
        const student = await Student.findOne({
          studentId: String(studentId).trim()
        });

        if (!student) {
          errors.push({
            row: i + 2,
            message: `Student ${studentId} not found`
          });

          continue;
        }

        // Find subject
        const subject = await Subject.findOne({
          code: String(subjectCode).trim().toUpperCase()
        });

        if (!subject) {
          errors.push({
            row: i + 2,
            message: `Subject ${subjectCode} not found`
          });

          continue;
        }

        const finalMaxMarks =
          Number(maxMarks) || subject.maxMarks || 100;

        const finalMarks = Number(marksObtained);

        if (finalMarks < 0 || finalMarks > finalMaxMarks) {
          errors.push({
            row: i + 2,
            message: "Invalid marks"
          });

          continue;
        }

        // Calculate
        const percentage = calculatePercentage(
          finalMarks,
          finalMaxMarks
        );

        const grade = calculateGrade(percentage);

        const status = calculateStatus(percentage);

        // Create result
        const result = await Result.create({
          student: student._id,
          subject: subject._id,
          semester: Number(semester),
          examType: examType || "Final",
          marksObtained: finalMarks,
          maxMarks: finalMaxMarks,
          percentage,
          grade,
          status,
          remarks
        });

        results.push(result);
      } catch (rowError) {
        errors.push({
          row: i + 2,
          message: rowError.message
        });
      }
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Excel processed successfully",
      totalRows: rows.length,
      successful: results.length,
      failed: errors.length,
      errors,
      results
    });
  } catch (error) {
    console.error("Upload result error:", error.message);

    // Delete file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to process Excel file"
    });
  }
};