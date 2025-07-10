// backend/src/routes/scraping_and_ner_pipeline/run_all_routes.ts
import { Router } from 'express';
import { runAllPipeline, testPipeline } from '../../controllers/scraping_and_ner_pipeline/run_all_controller';

const router = Router();

// Add a test endpoint to verify routes are working
router.get('/test', testPipeline);
router.post('/run-all', runAllPipeline);

export default router;