import { Router } from 'express';
import { Card2Controller } from '../../controllers/card2/card2_controller';

const card2Router = Router();

// GET /api/card2/latest
card2Router.get('/latest', Card2Controller.getLatestCard2);

export default card2Router;
