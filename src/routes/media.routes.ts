import { Router } from 'express';
import { uploadImage, uploadMultipleImages, getMedia, deleteMedia } from '../controllers/media.controller';
import { protect } from '../middleware/auth';
import { uploadImage as uploadMiddleware } from '../middleware/upload';

const router = Router();

// All media endpoints are protected for admin
router.use(protect);

router.post('/upload', uploadMiddleware.single('image'), uploadImage);
router.post('/upload-multiple', uploadMiddleware.array('images', 10), uploadMultipleImages);
router.get('/', getMedia);
router.delete('/:id', deleteMedia);

export default router;
