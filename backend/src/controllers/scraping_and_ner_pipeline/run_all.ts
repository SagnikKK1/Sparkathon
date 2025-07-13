import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface PipelineArgs {
  product: string;
  product_type: string;
  video_limit: number;
  since: string;
  min_len?: number;
  post_limit?: number;
  venvDir?: string; // Optional: path to the .venv directory to use
}

function getVenvPython(venvDir: string): string {
  // Windows: Scripts/python.exe, Linux/Mac: bin/python
  const winPython = path.join(venvDir, 'Scripts', 'python.exe');
  const unixPython = path.join(venvDir, 'bin', 'python');
  if (fs.existsSync(winPython)) return winPython;
  if (fs.existsSync(unixPython)) return unixPython;
  throw new Error(`No Python executable found in venv: ${venvDir}`);
}

export function runPythonPipelineDetached(args: PipelineArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../../../NER_and_Dashboard/src/run_all.py');

    console.log('[DEBUG] Resolved script path:', scriptPath);
    console.log('[DEBUG] Current __dirname:', __dirname);
    console.log('[DEBUG] Script exists:', fs.existsSync(scriptPath));

    if (!fs.existsSync(scriptPath)) {
      console.error('[ERROR] Python script not found at:', scriptPath);
      reject(new Error(`Python script not found at: ${scriptPath}`));
      return;
    }

    // Determine the venv directory (default: sibling to scriptPath)
    let venvDir = args.venvDir;
    if (!venvDir) {
      // Try to find .venv in the script's parent or grandparent directory
      const parent = path.dirname(scriptPath);
      const grandparent = path.dirname(parent);
      const venvInParent = path.join(parent, '.venv');
      const venvInGrandparent = path.join(grandparent, '.venv');
      if (fs.existsSync(venvInParent)) venvDir = venvInParent;
      else if (fs.existsSync(venvInGrandparent)) venvDir = venvInGrandparent;
      else throw new Error('No .venv directory found near script. Please specify venvDir.');
    }

    let pythonExe: string;
    try {
      pythonExe = getVenvPython(venvDir);
    } catch (err) {
      reject(err);
      return;
    }

    const pyArgs = [
      scriptPath,
      '--product', args.product,
      '--product_type', args.product_type,
      '--video_limit', String(args.video_limit),
      '--since', args.since,
    ];

    if (args.min_len !== undefined) {
      pyArgs.push('--min_len', String(args.min_len));
    }
    if (args.post_limit !== undefined) {
      pyArgs.push('--post_limit', String(args.post_limit));
    }

    console.log('[DEBUG] Using Python executable:', pythonExe);
    console.log('[DEBUG] Python command arguments:', pyArgs);
    console.log('[DEBUG] Working directory:', path.dirname(scriptPath));

    const child = spawn(pythonExe, pyArgs, {
      cwd: path.dirname(scriptPath),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(`[PYTHON STDOUT] ${output}`);
    });

    child.stderr?.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      console.error(`[PYTHON STDERR] ${output}`);
    });

    child.on('close', (code) => {
      console.log(`[DEBUG] Python process exited with code: ${code}`);
      if (code === 0) {
        console.log('[INFO] Python pipeline completed successfully');
        resolve();
      } else {
        console.error(`[ERROR] Python pipeline failed with exit code: ${code}`);
        console.error('[ERROR] Python stderr:', stderr);
        reject(new Error(`Pipeline failed with code ${code}. Error: ${stderr || 'Unknown error'}`));
      }
    });

    child.on('error', (error: any) => {
      console.error(`[ERROR] Failed to spawn Python process:`, error);
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    setTimeout(() => {
      if (!child.killed) {
        child.unref();
        console.log(`[DEBUG] Detached Python process`);
      }
    }, 1000);
  });
}

// Utility function to test Python installation in a venv
export async function testPythonInstallation(venvDir: string): Promise<void> {
  let pythonExe: string;
  try {
    pythonExe = getVenvPython(venvDir);
  } catch (err) {
    console.error('[ERROR] No Python executable found in venv:', err);
    return;
  }

  console.log('[DEBUG] Testing Python interpreter:', pythonExe);

  const child = spawn(pythonExe, ['--version'], { stdio: 'pipe' });

  await new Promise<void>((resolve) => {
    let output = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.stderr?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`[INFO] Python found: ${output.trim()}`);
      } else {
        console.log(`[DEBUG] Python failed with code: ${code}`);
      }
      resolve();
    });

    child.on('error', (error) => {
      console.log(`[DEBUG] Python not found: ${error.message}`);
      resolve();
    });
  });
}
