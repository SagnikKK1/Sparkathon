import express from 'express';
import {
  runReportPipeline,
  getLatestPrereport,
  getLatestCleanedreport,
} from '../../controllers/report/report_fetch_controller';

const reportFetchRouter = express.Router();

reportFetchRouter.post('/pipeline/report', runReportPipeline);
reportFetchRouter.get('/prereport/latest', getLatestPrereport);
reportFetchRouter.get('/cleanedreport/latest', getLatestCleanedreport);

export default reportFetchRouter;
