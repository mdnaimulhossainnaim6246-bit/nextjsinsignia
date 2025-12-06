


// routes/packagesRoutes.js

import express from "express";
import {
  addPackages,
  updatePackages,
  deletePackagesById,
  getAllPackages,
  getPackagesById,
  togglePublish,
  getPackagesByPlaceName, // নতুন function
} from "../controllers/packagesController.js";

import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const packagesRouter = express.Router();

// const uploadFields = [
//   { name: 'image', maxCount: 1 },
//   { name: 'dynamic_image_0', maxCount: 1 },
//   { name: 'dynamic_image_1', maxCount: 1 },
//   { name: 'dynamic_image_2', maxCount: 1 },
//   { name: 'dynamic_image_3', maxCount: 1 },
//   { name: 'dynamic_image_4', maxCount: 1 },
//   { name: 'dynamic_image_5', maxCount: 1 },
//   { name: 'dynamic_image_6', maxCount: 1 },
//   { name: 'dynamic_image_7', maxCount: 1 },
//   { name: 'dynamic_image_8', maxCount: 1 },
//   { name: 'dynamic_image_9', maxCount: 1 },
// ];

const uploadFields = [
  { name: 'image', maxCount: 1 },
  { name: 'summary_image1', maxCount: 1 },
  { name: 'summary_image2', maxCount: 1 },
  { name: 'galleryImages', maxCount: 100 },
  ...Array.from({ length: 100 }, (_, index) => ({
    name: `dynamic_image_${index}`,
    maxCount: 1,
  })),
];

// ✅ POST /adddiscover - Add new discover post
packagesRouter.post("/", auth, upload.fields(uploadFields), addPackages);

// ✅ PUT /adddiscover/update/:id - Update existing discover post
packagesRouter.put("/update/:id", auth, upload.fields(uploadFields), updatePackages);

// ✅ GET /adddiscover/all - Get all discover posts
packagesRouter.get("/all", getAllPackages);

// ✅ 🔍 NEW: Get discover by placename (must be before ID route!)
packagesRouter.get("/by-placename/:placename", getPackagesByPlaceName);

// ✅ POST /adddiscover/delete - Delete a discover post by ID
packagesRouter.post("/delete", auth, deletePackagesById);

// ✅ POST /adddiscover/toggle-publish - Toggle publish state
packagesRouter.post("/toggle-publish", auth, togglePublish);

// ✅ GET /adddiscover/:discoverId - Get single discover post by ID (must be last)
packagesRouter.get("/:packagesId", getPackagesById);

export default packagesRouter;
