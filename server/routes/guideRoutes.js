import express from 'express';
import {
  createGuide,
  getAllGuides,
  getGuideById,
  getGuideBySlug,
  deleteGuideById,
  togglePublishGuide,
  updateGuide,
  deleteManyGuides,
} from '../controllers/guideController.js';

import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/guide', auth, upload.any(), createGuide);
router.get('/all', getAllGuides);
router.get('/slug/:slug', getGuideBySlug);
router.get('/:id', getGuideById);
router.post('/delete', auth, deleteGuideById);
router.post('/toggle-publish', auth, togglePublishGuide);
router.post('/update/:id', auth, upload.any(), updateGuide);
router.post('/delete-many', auth, deleteManyGuides);

export default router;
