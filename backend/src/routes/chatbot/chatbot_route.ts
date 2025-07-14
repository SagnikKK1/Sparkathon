import express from 'express';
import {
  receiveUserQuery,
  getSystemResponse,
} from '../../controllers/chatbot/chatbot_controller';

const chatBotRouter = express.Router();

/**
 * @route POST /api/chatbot/query
 * @desc  Receive a user query, run the pipeline, and store the response
 * @body  { userQuery: string }
 */
chatBotRouter.post('/chatbot/query', receiveUserQuery);

/**
 * @route GET /api/chatbot/response
 * @desc  Fetch the latest system response for a given user query (or latest overall)
 * @query userQuery (optional)
 */
chatBotRouter.get('/chatbot/response', getSystemResponse);

export default chatBotRouter;
