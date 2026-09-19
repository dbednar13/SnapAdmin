import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { CircularBuffer } from 'circle-buffer';
import { sanitizeAdditionalArguments } from 'common';
import { Request, Response } from 'express';

export function executeCommand(
  state: {
    child: ChildProcessWithoutNullStreams | undefined;
    clients: Response[];
  },
  buffer: CircularBuffer,
  req: Request,
  res: Response,
  broadcast: (event: string, text: string) => void
) {
  const { command } = req.body as { command?: string };

  if (state.child) {
    return res.status(400).json({
      message:
        'A SnapRaid process is already running. Please stop it before starting a new one.',
    });
  }

  if (!command || typeof command !== 'string') {
    return res.status(400).json({
      message: 'Command is required.',
    });
  }

  const sanitizedCommand = sanitizeAdditionalArguments(command);

  const normalizedCommand = sanitizedCommand
    .trim()
    .replace(/^\s*\/usr\/bin\/snapraid\s*/i, '')
    .replace(/^\s*snapraid\s*/i, '')
    .trim();

  if (!normalizedCommand) {
    return res.status(400).json({
      message: 'Command is invalid.',
    });
  }

  //const configPath = sanitizeValue('/etc/snapraid.conf');
  const args = [...normalizedCommand.split(/\s+/)];

  state.child = spawn('snapraid', args, {
    shell: false,
    env: process.env,
  });

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

  return res.status(200).json({
    message: `Started Command ${normalizedCommand}`,
  });
}
