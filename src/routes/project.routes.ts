import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', getPublicProjects);
router.get('/public/:slug', getPublicProjectBySlug);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
