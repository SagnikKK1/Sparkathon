// run_all.ts
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
}

export function runPythonPipelineDetached(args: PipelineArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../../../NER_and_Dashboard/src/run_all.py');
    
    console.log('[DEBUG] Resolved script path:', scriptPath);
    console.log('[DEBUG] Current __dirname:', __dirname);
    console.log('[DEBUG] Script exists:', fs.existsSync(scriptPath));
    
    // Check if the Python script exists
    if (!fs.existsSync(scriptPath)) {
      console.error('[ERROR] Python script not found at:', scriptPath);
      reject(new Error(`Python script not found at: ${scriptPath}`));
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
    
    console.log('[DEBUG] Python command arguments:', pyArgs);
    console.log('[DEBUG] Working directory:', path.dirname(scriptPath));
    
    // Try different Python executables for Windows compatibility
    const pythonExecutables = ['python', 'python3', 'py'];
    
    const tryPythonExecutable = (executableIndex: number): void => {
      if (executableIndex >= pythonExecutables.length) {
        reject(new Error('No working Python executable found. Tried: ' + pythonExecutables.join(', ')));
        return;
      }
      
      const pythonExe = pythonExecutables[executableIndex];
      console.log(`[DEBUG] Trying Python executable: ${pythonExe}`);
      
      const child = spawn(pythonExe, pyArgs, {
        cwd: path.dirname(scriptPath),
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'], // Capture stdout and stderr
        detached: false, // Keep attached initially to capture errors
      });
      
      let stdout = '';
      let stderr = '';
      
      // Capture stdout
      child.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log(`[PYTHON STDOUT] ${output}`);
      });
      
      // Capture stderr
      child.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.error(`[PYTHON STDERR] ${output}`);
      });
      
      // Handle process completion
      child.on('close', (code) => {
        console.log(`[DEBUG] Python process ${pythonExe} exited with code: ${code}`);
        
        if (code === 0) {
          console.log('[INFO] Python pipeline completed successfully');
          resolve();
        } else {
          console.error(`[ERROR] Python pipeline failed with exit code: ${code}`);
          console.error('[ERROR] Python stderr:', stderr);
          reject(new Error(`Pipeline failed with code ${code}. Error: ${stderr || 'Unknown error'}`));
        }
      });
      
      // Handle spawn errors
      child.on('error', (error: any) => {
        console.error(`[ERROR] Failed to spawn Python process with ${pythonExe}:`, error);
        
        // If this is a "file not found" error (ENOENT), try the next executable
        if (error.code === 'ENOENT' || error.message.includes('ENOENT')) {
          console.log(`[DEBUG] ${pythonExe} not found, trying next executable...`);
          tryPythonExecutable(executableIndex + 1);
        } else {
          reject(new Error(`Failed to start Python process: ${error.message}`));
        }
      });
      
      // For long-running processes, detach after a short delay
      setTimeout(() => {
        if (!child.killed) {
          child.unref();
          console.log(`[DEBUG] Detached Python process ${pythonExe}`);
        }
      }, 1000);
    };
    
    // Start trying Python executables
    tryPythonExecutable(0);
  });
}

// Utility function to test Python installation
export async function testPythonInstallation(): Promise<void> {
  const pythonExecutables = ['python', 'python3', 'py'];
  
  console.log('[DEBUG] Testing Python installations...');
  
  for (const exe of pythonExecutables) {
    try {
      const child = spawn(exe, ['--version'], { stdio: 'pipe' });
      
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
            console.log(`[INFO] ${exe} found: ${output.trim()}`);
          } else {
            console.log(`[DEBUG] ${exe} failed with code: ${code}`);
          }
          resolve();
        });
        
        child.on('error', (error) => {
          console.log(`[DEBUG] ${exe} not found: ${error.message}`);
          resolve();
        });
      });
    } catch (error) {
      console.log(`[DEBUG] Error testing ${exe}:`, error);
    }
  }
}