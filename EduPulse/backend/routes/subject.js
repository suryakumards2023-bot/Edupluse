import express from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subject.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createSubject);

router.get("/", protect, getSubjects);

router.get("/:id", protect, getSubjectById);

router.put("/:id", protect, updateSubject);

router.delete("/:id", protect, deleteSubject);

export default router;