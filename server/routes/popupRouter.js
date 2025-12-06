import express from 'express';
const router = express.Router();
import { createPopup, getPopups, deletePopup } from '../controllers/popupController.js';

router.post('/popups', createPopup);
router.get('/popups', getPopups);
router.delete('/popups/:id', deletePopup);

export default router;
