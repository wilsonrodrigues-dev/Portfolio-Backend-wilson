import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller';
import { protect, optionalAuth } from '../middleware/auth';

const router = Router();

// Public: GET /api/testimonials?public=true
router.get('/', optionalAuth, getTestimonials);
router.get('/:id', optionalAuth, getTestimonialById);

// Admin protected routes
router.use(protect);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;

