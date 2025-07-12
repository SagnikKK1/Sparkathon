import { Router } from 'express';
import { Card3Controller } from '../../controllers/card3/card3_controller';

const card3Router = Router();

// GET /api/card3/latest
card3Router.get('/latest', Card3Controller.getLatestCard3);

export default card3Router;
