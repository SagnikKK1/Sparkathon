// backend/src/controllers/chatbot/chatbot_controller.ts

import { Request, Response } from 'express';
import { prisma } from '../../global_prisma/prisma';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Helper to get the Python executable from a .venv directory.
 */
function getVenvPython(venvDir: string): string {
  const winPython = path.join(venvDir, 'Scripts', 'python.exe');
  const unixPython = path.join(venvDir, 'bin', 'python');
  if (fs.existsSync(winPython)) {
    console.debug(`[DEBUG] Found Windows Python executable at: ${winPython}`);
    return winPython;
  }
  if (fs.existsSync(unixPython)) {
    console.debug(`[DEBUG] Found Unix Python executable at: ${unixPython}`);
    return unixPython;
  }
  console.error(`[ERROR] No Python executable found in venv: ${venvDir}`);
  throw new Error(`No Python executable found in venv: ${venvDir}`);
}

/**
 * Helper to traverse upwards from a starting directory to find .venv
 */
function findVenvDir(startDir: string): string | undefined {
  let dir = startDir;
  for (let i = 0; i < 8; i++) { // Limit to 8 levels up for safety
    const candidate = path.join(dir, '.venv');
    console.debug(`[DEBUG] Checking for venv at: ${candidate}`);
    if (fs.existsSync(candidate)) {
      console.debug(`[DEBUG] Found .venv at: ${candidate}`);
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // Reached filesystem root
    dir = parent;
  }
  console.warn('[WARN] .venv not found in any parent directories.');
  return undefined;
}

/**
 * Runs query.py with the user query as an argument using the correct venv Python.
 * Returns the system response (stdout from the script).
 */
export function runQueryPyWithVenv(userQuery: string, venvDir?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../../../../../SparKaRag/RAG/query.py');
    console.debug(`[DEBUG] Resolved script path: ${scriptPath}`);

    // Find .venv directory if not provided
    if (!venvDir) {
      const searchStart = path.resolve(__dirname, '../../../../../../SparKaRag/RAG');
      console.debug(`[DEBUG] Starting venv search from: ${searchStart}`);
      const venv = findVenvDir(searchStart);
      if (!venv) {
        console.error('[ERROR] No .venv directory found in project root or parent folders.');
        return reject(new Error('No .venv directory found in project root or parent folders.'));
      }
      venvDir = venv;
    }

    let pythonExe: string;
    try {
      pythonExe = getVenvPython(venvDir);
      console.debug(`[DEBUG] Using Python executable: ${pythonExe}`);
    } catch (err) {
      console.error('[ERROR] Failed to get Python executable:', err);
      return reject(err);
    }

    console.debug(`[DEBUG] Spawning Python process: ${pythonExe} ${scriptPath} "${userQuery}"`);
    const child = spawn(pythonExe, [scriptPath, userQuery], {
      cwd: path.dirname(scriptPath),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    let output = '';
    let errorOutput = '';

    child.stdout?.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.debug(`[PYTHON STDOUT] ${chunk}`);
    });

    child.stderr?.on('data', (data) => {
      const chunk = data.toString();
      errorOutput += chunk;
      console.error(`[PYTHON STDERR] ${chunk}`);
    });

    child.on('close', (code) => {
      console.debug(`[DEBUG] Python process exited with code: ${code}`);
      if (code === 0) {
        console.info('[INFO] Python script completed successfully.');
        resolve(output.trim());
      } else {
        console.error(`[ERROR] query.py exited with code ${code}: ${errorOutput}`);
        reject(new Error(`query.py exited with code ${code}: ${errorOutput}`));
      }
    });

    child.on('error', (err) => {
      console.error('[ERROR] Failed to spawn Python process:', err);
      reject(err);
    });

    setTimeout(() => {
      if (!child.killed) {
        child.unref();
        console.debug('[DEBUG] Detached Python process');
      }
    }, 1000);
  });
}

/**
 * Receives a user query and triggers the pipeline.
 * Expects { userQuery: string } in the POST body.
 */
export async function receiveUserQuery(req: Request, res: Response): Promise<void> {
  console.debug('[DEBUG] receiveUserQuery called');
  const userQuery = req.body.userQuery;
  console.debug(`[DEBUG] Received userQuery: ${userQuery}`);
  if (!userQuery || typeof userQuery !== 'string') {
    console.warn('[WARN] userQuery is missing or not a string.');
    res.status(400).json({ success: false, message: 'userQuery is required.' });
    return;
  }

  // Find the venv directory by searching upwards from the RAG directory
  let venvDir: string | undefined;
  try {
    const ragDir = path.resolve(__dirname, '../../../../../../SparKaRag/RAG');
    console.debug(`[DEBUG] Searching for venv from RAG dir: ${ragDir}`);
    venvDir = findVenvDir(ragDir);
    if (!venvDir) throw new Error('No .venv directory found in project root or parent folders.');
    console.debug(`[DEBUG] Using venvDir: ${venvDir}`);
  } catch (err) {
    console.error('[ERROR] Failed to locate Python virtual environment:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to locate Python virtual environment (.venv) in project root or parent folders.',
      error: err instanceof Error ? err.message : String(err)
    });
    return;
  }

  try {
    console.info('[INFO] Running query.py with venv...');
    const systemResponse = await runQueryPyWithVenv(userQuery, venvDir);

    console.info('[INFO] Returning system response to client.');
    res.status(200).json({
      success: true,
      userQuery,
      systemResponse,
      message: 'Query processed and response stored.'
    });
  } catch (error) {
    console.error('Chatbot query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query.',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Fetches the latest system response for a given user query from the database.
 * If userQuery is provided, fetches the latest matching message.
 * If not, fetches the latest message overall.
 */
export async function getSystemResponse(req: Request, res: Response): Promise<void> {
  console.debug('[DEBUG] getSystemResponse called');
  const userQuery = req.query.userQuery as string | undefined;
  console.debug(`[DEBUG] userQuery param: ${userQuery}`);

  try {
    const whereClause = userQuery
      ? { userQuery: userQuery }
      : {};

    console.debug('[DEBUG] Prisma where clause:', whereClause);

    const message = await prisma.chatbotMessage.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (!message) {
      console.warn('[WARN] No response found for query.');
      res.status(404).json({ success: false, message: 'No response found.' });
      return;
    }

    console.info('[INFO] Returning latest chatbot message.');
    res.status(200).json({
      success: true,
      data: {
        id: message.id,
        userQuery: message.userQuery,
        systemResponse: message.systemResponse,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      }
    });
  } catch (error) {
    console.error('[ERROR] Failed to fetch response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response.',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
