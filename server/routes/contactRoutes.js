import express from 'express';
import { handleContactForm } from '../controllers/contactController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/', upload.single('profileImage'), handleContactForm);

export default router;
