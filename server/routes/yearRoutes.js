
import express from 'express';
import { addYear, getAllYears, deleteYearById } from '../controllers/yearController.js';

const router = express.Router();

router.post('/', addYear);
router.get('/', getAllYears);
router.delete('/:id', deleteYearById);

export default router;
