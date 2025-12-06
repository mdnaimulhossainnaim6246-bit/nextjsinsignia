import express from 'express';
import { getAboutNumber, updateAboutNumber } from '../controllers/aboutnumberController.js';

const router = express.Router();

router.get('/about-number', getAboutNumber);
router.put('/about-number', updateAboutNumber);

export default router;