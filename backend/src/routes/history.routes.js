import { Router } from 'express';
import * as historyController from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, historyController.getHistory);

export default router;
