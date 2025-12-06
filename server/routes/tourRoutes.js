// // routes/tourRouter.js 


import express from "express";
import {
  addTour,
  deleteTourById,
  getAllTour,
  getTourById,
  getTourByPlaceName,
  togglePublish,
  updateTour
} from "../controllers/tourController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const tourRouter = express.Router();

// POST /tour
tourRouter.post("/", upload.single('image'), auth, addTour);

// PUT /tour/:id
tourRouter.put("/:id", upload.single('image'), auth, updateTour);

// GET /tour/all
tourRouter.get('/all', getAllTour);

// GET /tour/by-place-name/:placename
tourRouter.get('/by-place-name/:placename', getTourByPlaceName);

// GET /tour/:tourId (must be last to avoid conflict with /all)
tourRouter.get('/:tourId', getTourById);

// POST /tour/delete
tourRouter.post('/delete', auth, deleteTourById);

// POST /tour/toggle-publish
tourRouter.post('/toggle-publish', auth, togglePublish);

export default tourRouter;
