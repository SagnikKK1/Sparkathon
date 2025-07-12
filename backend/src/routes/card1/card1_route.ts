import { Router } from 'express';
import { Card1Controller } from '../../controllers/card1/card1_controller';

const card1Router = Router();

// GET /api/card1/latest
card1Router.get('/latest', Card1Controller.getLatestCard1);

export default card1Router;
