import express from "express";
import {
  addGroupTour,
  getAllGroupTours,
  getGroupTourById,
  deleteGroupTourById,
  togglePublishGroupTour,
  updateGroupTour,
  deleteManyGroupTours,
} from "../controllers/groupTourController.js";

import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single('image'), addGroupTour);
router.get("/all", getAllGroupTours);
router.get("/:id", getGroupTourById);
router.post("/delete", deleteGroupTourById);
router.post("/toggle-publish", togglePublishGroupTour);
router.post("/update/:id", upload.single('image'), updateGroupTour);
router.post("/delete-many", deleteManyGroupTours);

export default router;
