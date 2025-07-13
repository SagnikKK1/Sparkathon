// backend/src/controllers/scraping_and_ner_pipeline/run_all_controller.ts

import { Request, Response } from 'express';
import { runPythonPipelineDetached, testPythonInstallation } from './run_all';
import { prisma } from '../../global_prisma/prisma';
import path from 'path';
import fs from 'fs';

/**
 * Runs the full scraping and NER pipeline using the correct Python virtual environment.
 * Ensures the Python script is run with the interpreter from the appropriate .venv.
 */
export async function runAllPipeline(req: Request, res: Response): Promise<void> {
  console.log(`[INFO] ==> Received request to start pipeline at ${new Date().toISOString()}`);
  console.log('[DEBUG] Request method:', req.method);
  console.log('[DEBUG] Request URL:', req.url);
  console.log('[DEBUG] Request headers:', req.headers);
  console.log('[DEBUG] Request Body:', req.body);

  const { product, product_type, video_limit, since, min_len, post_limit } = req.body;

  // Validate required fields
  if (!product || !product_type || !video_limit || !since) {
    console.log('[ERROR] Missing required fields');
    res.status(400).json({
      error: 'Missing required fields',
      required: ['product', 'product_type', 'video_limit', 'since'],
      received: { product, product_type, video_limit, since }
    });
    return;
  }

  let pipelineStatus;

  try {
    console.log('[INFO] 1. Creating initial pipeline status record...');
    pipelineStatus = await prisma.pipelineStatus.create({
      data: {
        pipelineSuccess: null, // null indicates "in-progress"
        pipelineMessage: 'Pipeline process initiated.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`[INFO] Success! Pipeline status record created with ID: ${pipelineStatus.id}`);
  } catch (dbError) {
    console.error('[ERROR] Failed to create pipeline status record in database:', dbError);
    res.status(500).json({ error: 'Failed to initialize pipeline status in the database.' });
    return;
  }

  try {
    // Determine the .venv directory (assumes .venv is in the NER_and_Dashboard project)
    // Adjust this logic if your structure is different
    const scriptPath = path.resolve(__dirname, '../../../../NER_and_Dashboard/src/run_all.py');
    let venvDir: string | undefined;
    const parent = path.dirname(scriptPath);
    const grandparent = path.dirname(parent);
    const venvInParent = path.join(parent, '.venv');
    const venvInGrandparent = path.join(grandparent, '.venv');
    if (fs.existsSync(venvInParent)) venvDir = venvInParent;
    else if (fs.existsSync(venvInGrandparent)) venvDir = venvInGrandparent;
    else venvDir = undefined;

    if (!venvDir) {
      throw new Error('No .venv directory found near script. Please ensure the correct virtual environment is present.');
    }

    console.log('[INFO] 2. Spawning Python pipeline script with arguments:', { product, product_type, video_limit, since, min_len, post_limit, venvDir });

    await runPythonPipelineDetached({
      product,
      product_type,
      video_limit,
      since,
      min_len,
      post_limit,
      venvDir,
    });

    console.log('[INFO] Success! Python script process has been started.');

    console.log(`[INFO] 3. Updating pipeline status (ID: ${pipelineStatus.id}) to success...`);
    await prisma.pipelineStatus.update({
      where: { id: pipelineStatus.id },
      data: {
        pipelineSuccess: true,
        pipelineMessage: 'Pipeline process launched successfully.',
        updatedAt: new Date(),
      },
    });
    console.log('[INFO] Success! Pipeline status record updated.');

    res.status(202).json({
      message: 'Pipeline process started successfully.',
      statusId: pipelineStatus.id
    });
  } catch (pipelineError: any) {
    console.error('[ERROR] Failed to execute or run the Python pipeline script:', pipelineError);

    try {
      console.log(`[INFO] 3. Updating pipeline status (ID: ${pipelineStatus.id}) to failure...`);
      await prisma.pipelineStatus.update({
        where: { id: pipelineStatus.id },
        data: {
          pipelineSuccess: false,
          pipelineMessage: pipelineError.message || 'An unknown error occurred while running the pipeline.',
          updatedAt: new Date(),
        },
      });
      console.log('[INFO] Success! Pipeline status record updated to failure state.');
    } catch (dbUpdateError) {
      console.error('[ERROR] CRITICAL: Failed to update pipeline status to FAILED after a pipeline error.', dbUpdateError);
    }

    res.status(500).json({ error: pipelineError.message || 'Failed to start the pipeline process.' });
  }
}

/**
 * Test endpoint to verify the Python interpreter in the .venv can be found and used.
 * Optionally, you can pass a venvDir query parameter to test a specific environment.
 */
export async function testPipeline(req: Request, res: Response): Promise<void> {
  console.log('[INFO] Test endpoint called');

  // Optionally allow testing a specific venvDir
  const venvDir = typeof req.query.venvDir === 'string' ? req.query.venvDir : undefined;

  try {
    await testPythonInstallation(venvDir || '');
    res.json({
      message: 'Pipeline route is working!',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      pythonTest: 'Check server logs for Python installation details'
    });
  } catch (error) {
    console.error('[ERROR] Python test failed:', error);
    res.status(500).json({
      error: 'Python test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
