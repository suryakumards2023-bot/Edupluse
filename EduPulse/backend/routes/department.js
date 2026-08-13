import express from "express";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/department.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createDepartment);

router.get("/", protect, getDepartments);

router.get("/:id", protect, getDepartmentById);

router.put("/:id", protect, updateDepartment);

router.delete("/:id", protect, deleteDepartment);

export default router;