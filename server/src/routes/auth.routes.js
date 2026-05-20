import { Router } from 'express';
import { register, login, logout, refreshAccessToken, getMe, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', authenticate, getMe);
router.patch('/update-profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
