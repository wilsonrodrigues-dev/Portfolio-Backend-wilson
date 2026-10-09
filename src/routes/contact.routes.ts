import { Router } from 'express';
import {
  submitContact,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from '../controllers/contact.controller';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for contact submission: max 5 messages per 15 mins per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many message submissions. Please try again later.' },
});

// PUBLIC ROUTE
router.post('/', contactLimiter, submitContact);

// ADMIN ROUTES (PROTECTED)
router.use(protect);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.patch('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
