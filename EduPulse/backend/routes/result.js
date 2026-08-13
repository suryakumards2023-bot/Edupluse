import express from "express";

import {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
  generateStudentResultPDF
} from "../controllers/result.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createResult);

router.get("/", protect, getResults);

router.get(
  "/student/:studentId/pdf",
  protect,
  generateStudentResultPDF
);

router.get("/:id", protect, getResultById);

router.put("/:id", protect, updateResult);

router.delete("/:id", protect, deleteResult);

export default router;