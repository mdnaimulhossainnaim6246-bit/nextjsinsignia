import express from "express";
import {
  addOurTravelers,
  deleteOurTravelersById,
  getAllOurTravelers,
  getOurTravelersById,
  togglePublishOurTravelers,
  updateOurTravelers
} from "../controllers/ourTravelersController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const ourTravelersRouter = express.Router();

// POST /ourtravelers
ourTravelersRouter.post("/", upload.any(), auth, addOurTravelers);

// PUT /ourtravelers/:id
ourTravelersRouter.put("/:id", upload.any(), auth, updateOurTravelers);

// GET /ourtravelers/all
ourTravelersRouter.get('/all', getAllOurTravelers);

// GET /ourtravelers/:ourTravelerId
ourTravelersRouter.get('/:ourTravelerId', getOurTravelersById);

// POST /ourtravelers/delete
ourTravelersRouter.post('/delete', auth, deleteOurTravelersById);

// POST /ourtravelers/toggle-publish
ourTravelersRouter.post('/toggle-publish', auth, togglePublishOurTravelers);

export default ourTravelersRouter;
