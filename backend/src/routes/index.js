import { Router } from 'express';
import moodRoutes from './mood.routes.js';
import authRoutes from './auth.routes.js';
import historyRoutes from './history.routes.js';

const router = Router();

router.use('/mood', moodRoutes);
router.use('/auth', authRoutes);
router.use('/history', historyRoutes);

export default router;
