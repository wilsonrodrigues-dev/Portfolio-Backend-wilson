import { Router } from 'express';
import { getExperiences, createExperience, getExperienceById, updateExperience, deleteExperience } from '../controllers/experience.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/public', getExperiences);
router.use(protect);
router.get('/', getExperiences);
router.post('/', createExperience);
router.get('/:id', getExperienceById);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
