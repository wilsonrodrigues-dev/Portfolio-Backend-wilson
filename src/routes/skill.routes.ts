import { Router } from 'express';
import { getSkills, createSkill, getSkillById, updateSkill, deleteSkill } from '../controllers/skill.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public: get visible skills
router.get('/public', (req, res, next) => {
  req.query.public = 'true';
  getSkills(req, res, next);
});

// Admin
router.use(protect);
router.get('/', getSkills);
router.post('/', createSkill);
router.get('/:id', getSkillById);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
