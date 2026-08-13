import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/student.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// Create student
router.post("/", protect, createStudent);

// Get all students
router.get("/", protect, getStudents);

// Get single student
router.get("/:id", protect, getStudentById);

// Update student
router.put("/:id", protect, updateStudent);

// Delete student
router.delete("/:id", protect, deleteStudent);

export default router;