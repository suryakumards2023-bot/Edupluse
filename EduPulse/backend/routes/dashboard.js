import express from "express";

import {
  getDashboardStats,
  getDepartmentPerformance,
  getSemesterPerformance,
  getTopStudents,
  getPassFailDistribution
} from "../controllers/dashboard.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// Dashboard statistics
router.get(
  "/stats",
  protect,
  getDashboardStats
);

// Department-wise performance
router.get(
  "/department-performance",
  protect,
  getDepartmentPerformance
);

// Semester-wise performance
router.get(
  "/semester-performance",
  protect,
  getSemesterPerformance
);

// Top performing students
router.get(
  "/top-students",
  protect,
  getTopStudents
);

// Pass / Fail distribution
router.get(
  "/pass-fail",
  protect,
  getPassFailDistribution
);

export default router;