import { Router } from 'express';
import { getHint, getFollowUp } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiRateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.use(authenticate);
router.use(aiRateLimit);

router.post('/hint', getHint);
router.get('/follow-up', getFollowUp);

export default router;
