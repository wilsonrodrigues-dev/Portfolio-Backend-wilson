import { Router } from 'express';
import { login, refresh, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generous limit: normal usage is ~1 refresh per 15 min per tab (single-flight).
// Only protects the endpoint from unauthenticated hammering.
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  message: { success: false, message: 'Too many refresh attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/refresh', refreshLimiter, refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
