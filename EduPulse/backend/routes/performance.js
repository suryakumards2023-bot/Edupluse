import express from "express";

import {
  getStudentPerformance
} from "../controllers/performance.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  protect,
  getStudentPerformance
);

export default router;