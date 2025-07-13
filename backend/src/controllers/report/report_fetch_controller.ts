import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';
import { spawn } from 'child_process';

// Helper to run a Python script and return a promise that resolves when the script finishes
function runPythonScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptName], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    pythonProcess.stdout.on('data', (data) => {
      process.stdout.write(`[PYTHON ${scriptName} STDOUT]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      process.stderr.write(`[PYTHON ${scriptName} STDERR]: ${data}`);
    });

    pythonProcess.on('error', (err) => {
      reject(err);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} exited with code ${code}`));
      }
    });
  });
}

// Start the report pipeline by running report.py and then report_backend.py sequentially
export async function runReportPipeline(req: Request, res: Response): Promise<void> {
  console.log(`[INFO] ==> Received request to start report pipeline at ${new Date().toISOString()}`);

  let pipelineStatus;
  try {
    pipelineStatus = await prisma.pipelineStatus.create({
      data: {
        pipelineSuccess: null,
        pipelineMessage: 'Report pipeline process initiated.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`[INFO] Pipeline status record created with ID: ${pipelineStatus.id}`);
  } catch (dbError) {
    console.error('[ERROR] Failed to create pipeline status record:', dbError);
    res.status(500).json({ error: 'Failed to initialize pipeline status.' });
    return;
  }

  try {
    console.log('[INFO] Running report.py...');
    await runPythonScript('C:/IITBBS/Projects/Walmart Sparkathon/Development/Sparkathon/SparKaRag/RAG/report.py');
    console.log('[INFO] report.py finished successfully.');

    console.log('[INFO] Running report_backend.py...');
    await runPythonScript('C:/IITBBS/Projects/Walmart Sparkathon/Development/Sparkathon/SparKaRag/RAG/report_backend.py');
    console.log('[INFO] report_backend.py finished successfully.');

    await prisma.pipelineStatus.update({
      where: { id: pipelineStatus.id },
      data: {
        pipelineSuccess: true,
        pipelineMessage: 'Report pipeline finished successfully.',
        updatedAt: new Date(),
      },
    });

    res.status(202).json({
      message: 'Report pipeline process finished successfully.',
      statusId: pipelineStatus.id,
    });
  } catch (pipelineError: any) {
    console.error('[ERROR] Failed to execute report pipeline:', pipelineError);

    try {
      await prisma.pipelineStatus.update({
        where: { id: pipelineStatus.id },
        data: {
          pipelineSuccess: false,
          pipelineMessage: pipelineError.message || 'Unknown error running report pipeline.',
          updatedAt: new Date(),
        },
      });
    } catch (dbUpdateError) {
      console.error('[ERROR] Failed to update pipeline status after error:', dbUpdateError);
    }

    res.status(500).json({ error: pipelineError.message || 'Failed to run the report pipeline.' });
  }
}

// Fetch the latest prereport record
export async function getLatestPrereport(req: Request, res: Response) {
  try {
    const report = await prisma.prereport.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    if (!report) {
      res.status(404).json({ message: 'No prereport found' });
      return;
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prereport data', error });
  }
}

// Fetch the latest cleanedreport record
export async function getLatestCleanedreport(req: Request, res: Response) {
  try {
    const report = await prisma.cleanedreport.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    if (!report) {
      res.status(404).json({ message: 'No cleanedreport found' });
      return;
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cleanedreport data', error });
  }
}
