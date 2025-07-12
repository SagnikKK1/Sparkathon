import { Router } from 'express';
import { Card4Controller } from '../../controllers/card4/card4_controller';

const card4Router = Router();

// GET /api/card4/latest
card4Router.get('/latest', Card4Controller.getLatestCard4);

export default card4Router;
