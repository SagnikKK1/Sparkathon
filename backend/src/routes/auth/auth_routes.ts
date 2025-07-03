import { Router } from 'express';
import { signup } from '../../controllers/auth/signup';
import { login } from '../../controllers/auth/login';
import { logout } from '../../controllers/auth/logout';
import { authenticateToken } from '../../middlewares/auth';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateToken, logout);

export default router;
