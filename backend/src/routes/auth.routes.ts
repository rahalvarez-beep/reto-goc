import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { authRateLimit } from '../middleware/security';
import { generalRateLimit } from '../middleware/security';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/verify-token', AuthController.verifyToken);

// Protected routes
router.use(authenticateToken as any);

router.post('/logout', AuthController.logout);
router.post('/logout-all', AuthController.logoutAll);
router.put('/change-password', AuthController.changePassword);
router.get('/profile', AuthController.getProfile);

export default router;
