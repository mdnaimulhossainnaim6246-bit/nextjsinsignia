import express from 'express';
import {
  createReview,
  updateReview,
  getAllReviews,
  getReviewBySlug,
  getReviewById,
  deleteReview,
  togglePublishReview,
  deleteManyReviews,
} from '../controllers/reviewController.js';

import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Use upload.any() to handle multiple files from different fields
router.post('/add', auth, upload.any(), createReview);
router.get('/all', getAllReviews);
router.get('/slug/:slug', getReviewBySlug);
router.get('/:id', getReviewById);
router.post('/delete', auth, deleteReview);
router.post('/toggle-publish', auth, togglePublishReview);
router.post('/update/:id', auth, upload.any(), updateReview);
router.post('/delete-many', auth, deleteManyReviews);

export default router;
