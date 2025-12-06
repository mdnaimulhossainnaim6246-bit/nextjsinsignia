
// routes/discoverRouter.js

import express from "express";
import {
  addDiscover,
  updateDiscover,
  deleteDiscoverById,
  getAllDiscover,
  getDiscoverById,
  togglePublish,
  getDiscoverByPlaceName,
  deleteManyDiscovers, 
  getDiscoverArticles, // For lightweight articles
} from "../controllers/discoverController.js";

import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const discoverRouter = express.Router();

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
  { name: 'galleryImages', maxCount: 50 }, // For gallery
  ...Array.from({ length: 100 }, (_, index) => ({
    name: `dynamic_image_${index}`,
    maxCount: 1,
  })),
];

// ✅ POST /adddiscover - Add new discover post
discoverRouter.post("/", auth, upload.fields(uploadFields), addDiscover);

// ✅ PUT /adddiscover/update/:id - Update existing discover post
discoverRouter.put("/update/:id", auth, upload.fields(uploadFields), updateDiscover);

// ✅ GET /adddiscover/all - Get all discover posts
discoverRouter.get("/all", getAllDiscover);

// ✅ GET /adddiscover/articles - Get lightweight articles for performance
discoverRouter.get("/articles", getDiscoverArticles);

// ✅ 🔍 NEW: Get discover by placename (must be before ID route!)
discoverRouter.get("/by-placename/:placename", getDiscoverByPlaceName);

// ✅ POST /adddiscover/delete - Delete a discover post by ID
discoverRouter.post("/delete", auth, deleteDiscoverById);

// ✅ POST /adddiscover/toggle-publish - Toggle publish state
discoverRouter.post("/toggle-publish", auth, togglePublish);

// ✅ POST /adddiscover/delete-many - Delete multiple discover posts
discoverRouter.post("/delete-many", auth, deleteManyDiscovers);

// ✅ GET /adddiscover/:discoverId - Get single discover post by ID (must be last)
discoverRouter.get("/:discoverId", getDiscoverById);

export default discoverRouter;
