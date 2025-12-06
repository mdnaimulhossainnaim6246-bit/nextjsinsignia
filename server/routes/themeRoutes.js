// themeRoutes.js
import express from "express";
import { getTheme, createOrUpdateTheme } from "../controllers/themeController.js";
import auth from "../middleware/auth.js"; // default import for auth middleware
import multer from "multer";

const router = express.Router();

// Using memory storage to handle files before uploading to ImageKit
const storage = multer.memoryStorage();
const upload = multer({ storage });

// This allows multer to handle multiple fields with dynamic names for sub-theme images
const cpUpload = upload.fields([
  { name: "mainThemeImage", maxCount: 1 },
  { name: "subThemeImages" } // Handles all files under this field name
]);

// Routes
router.get("/theme", getTheme);
router.post("/theme", auth, cpUpload, createOrUpdateTheme);

export default router;
