import { Router } from 'express';
import * as moodController from '../controllers/mood.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, moodController.analyzeMood);

export default router;
