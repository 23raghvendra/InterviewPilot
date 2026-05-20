import { Router } from 'express';
import { startInterview, getInterview, submitAnswer, skipQuestion, endInterview, getHistory, deleteInterview } from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiRateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/start', aiRateLimit, startInterview);
router.get('/history', getHistory);
router.get('/:sessionId', getInterview);
router.patch('/:sessionId/answer', aiRateLimit, submitAnswer);
router.patch('/:sessionId/skip', skipQuestion);
router.post('/:sessionId/end', aiRateLimit, endInterview);
router.delete('/:sessionId', deleteInterview);

export default router;
