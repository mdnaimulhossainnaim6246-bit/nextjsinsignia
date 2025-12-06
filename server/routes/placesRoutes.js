import express from 'express';
import { getPlacesWithCategories } from '../controllers/placesController.js';

const router = express.Router();

router.get('/places-with-categories', getPlacesWithCategories);

export default router;
