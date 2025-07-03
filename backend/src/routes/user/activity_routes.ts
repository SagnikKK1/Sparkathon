import { Router } from 'express';
import { updateUserActivity } from '../../controllers/user/activity';
import { authenticateToken } from '../../middlewares/auth';

const router = Router();

// Protected routes
router.post('/heartbeat', authenticateToken, updateUserActivity);

export default router;
