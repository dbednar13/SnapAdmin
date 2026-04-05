import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { CircularBuffer } from 'circle-buffer';
import { Request, Response } from 'express';

let child: ChildProcessWithoutNullStreams | undefined;
const buffer = new CircularBuffer({ limit: 500 });

export function postTest(req: Request, res: Response) {
  console.log('Received test request with body:', req.body);

  if (child) {
    return res.status(400).json({
      message:
        'A ping process is already running. Please stop it before starting a new one.',
    });
  }

  child = spawn('ping', ['-t', '-4', 'google.com']);

  child.on('error', (error) => {
    console.error('Failed to start child process:', error);
    child = undefined;

    if (!res.headersSent) {
      return res.status(500).json({
        message: 'Failed to start ping process.',
      });
    }
  });

  child.stdout.on('data', (data) => {
    buffer.forward(data.toString());
    console.log(`stdout: ${buffer.current()}`);
  });

  child.stderr.on('data', (data) => {
    buffer.forward(data.toString());
    console.error(`stderr: ${buffer.current()}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    child = undefined;
  });

  res.json({ message: 'Test endpoint', output: buffer.current() });
}

export function getTest(req: Request, res: Response) {
  // Return the current ping process status and the latest buffered output as JSON.
  if (!child) {
    return res.status(400).json({
      message: 'No ping process is currently running.',
    });
  }

  return res.json({
    message: 'Ping process is running',
    output: buffer.current(),
  });
}
