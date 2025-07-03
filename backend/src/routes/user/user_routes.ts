import { Router } from 'express';
import { getUserProfile } from '../../controllers/user/profile';
import { getAllUsers } from '../../controllers/user/get_all_users';
import { getOnlineUsers } from '../../controllers/user/get_online_users';
import { authenticateToken } from '../../middlewares/auth';

const router = Router();

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all', authenticateToken, getAllUsers);
router.get('/online', authenticateToken, getOnlineUsers);

export default router;
