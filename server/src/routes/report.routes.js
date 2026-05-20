import { Router } from 'express';
import { getReport, getUserReports, getStatsOverview } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats/overview', getStatsOverview);
router.get('/user/all', getUserReports);
router.get('/:reportId', getReport);

export default router;
