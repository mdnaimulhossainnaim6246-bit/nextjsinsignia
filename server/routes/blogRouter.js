import express from 'express';
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublishBlog,
  updateBlog,
  deleteManyBlogs,
} from '../controllers/blog.js';

import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/blog', auth, upload.any(), addBlog);
router.get('/all', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/delete', auth, deleteBlogById);
router.post('/toggle-publish', auth, togglePublishBlog);
router.post('/update/:id', auth, upload.any(), updateBlog);
router.post('/delete-many', auth, deleteManyBlogs);

export default router;