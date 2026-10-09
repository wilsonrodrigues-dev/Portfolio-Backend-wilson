import { Router } from 'express';
import {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller';
import { protect, optionalAuth } from '../middleware/auth';

const router = Router();

// Public: GET /api/services?public=true
router.get('/', optionalAuth, getServices);
router.get('/:id', optionalAuth, getServiceById);

// Admin protected routes
router.use(protect);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;

