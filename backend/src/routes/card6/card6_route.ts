import express from 'express';
import { Card6Controller } from '../../controllers/card6/card6_controller';

const card6Router = express.Router();

card6Router.get('/latest', Card6Controller.getLatestCard6);

export default card6Router;
