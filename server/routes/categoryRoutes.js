import express from "express";
import { getAllCategories, addCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/all", getAllCategories);
router.post("/add", addCategory);
router.post("/delete", deleteCategory);

export default router;
