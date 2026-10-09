import { Router } from 'express';
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', getPublicBlogs);
router.get('/public/:slug', getPublicBlogBySlug);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllBlogs);
router.post('/', createBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
