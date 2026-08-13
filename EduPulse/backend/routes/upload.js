import express from "express";
import multer from "multer";

import {
  uploadResults
} from "../controllers/upload.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage
});

// Upload result Excel
router.post(
  "/results",
  protect,
  upload.single("file"),
  uploadResults
);

export default router;