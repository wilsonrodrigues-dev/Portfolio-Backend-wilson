import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/about.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getAbout);
router.put('/', protect, updateAbout);

export default router;
