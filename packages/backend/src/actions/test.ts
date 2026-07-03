import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { CircularBuffer } from 'circle-buffer';
import { Request, Response } from 'express';

export function postTest(
  state: {
    child: ChildProcessWithoutNullStreams | undefined;
    clients: Response[];
  },
  buffer: CircularBuffer,
  req: Request,
  res: Response,
  broadcast: (event: string, text: string) => void
) {
  /*
   * Test notes.
   * This is working as I'd want it to.
   * The ping spawns off and runs in the background, and the output is collected and printed to the console.
   * The response is sent back immediately with the message and the output collected so far (which may be empty at that point).
   * The ping continues to run and print output to the console until it is manually stopped or the server is restarted.
   */
  console.log('Received test request with body:', req.body);

  if (state.child) {
    return res.status(400).json({
      message:
        'A ping process is already running. Please stop it before starting a new one.',
    });
  }

  state.child = spawn('ping', ['-t', '-4', 'google.com']);

  state.child.stdout.on('data', (data) => {
    const text = data.toString();
    buffer.forward(text);
    broadcast('message', text);
  });

  state.child.stderr.on('data', (data) => {
    const text = data.toString();
    buffer.forward(text);
    broadcast('message', text);
  });

  state.child.on('close', (code) => {
    state.child = undefined;
    const message = `child process exited with code ${code}`;
    broadcast('message', message);
  });
}

export function stopTest(
  state: {
    child: ChildProcessWithoutNullStreams | undefined;
    clients: Response[];
  },
  buffer: CircularBuffer,
  req: Request,
  res: Response,
  broadcast: (event: string, text: string) => void
) {
  if (!state.child) {
    return res.status(400).json({
      message: 'No ping process is currently running.',
    });
  }

  const child = state.child;
  child.kill();

  const message = 'Ping process stop requested.';
  broadcast('output', message);

  return res.json({ message, output: buffer.current() });
}
