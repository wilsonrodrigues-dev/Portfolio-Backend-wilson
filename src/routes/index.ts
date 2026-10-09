import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import blogRoutes from './blog.routes';
import skillRoutes from './skill.routes';
import experienceRoutes from './experience.routes';
import aboutRoutes from './about.routes';
import serviceRoutes from './service.routes';
import testimonialRoutes from './testimonial.routes';
import contactRoutes from './contact.routes';
import mediaRoutes from './media.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/skills', skillRoutes);
router.use('/experiences', experienceRoutes);
router.use('/about', aboutRoutes);
router.use('/services', serviceRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/media', mediaRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
