import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { CircularBuffer } from 'circle-buffer';
import { sanitizeCommandInput } from 'common';
import { Request, Response } from 'express';

import { getConfigFile } from '../config/serverConfig';

const getTimestamp = () => {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

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
  const { command } = req.body as {
    command?: string;
  };

  console.log('Received command:', command, req.body);

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

  const sanitizedCommand = sanitizeCommandInput(command);

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

  const args = [...normalizedCommand.split(/\s+/)];
  const configPath = getConfigFile().snapRaidConfigPath;
  if (configPath) {
    args.push('-c', configPath);
  }

  try {
    state.child = spawn('snapraid', args, {
      shell: false,
      env: process.env,
    });
  } catch (error) {
    console.error('Error spawning snapraid process:', error);
    return res.status(500).json({
      message: 'Failed to start SnapRaid process.',
    });
  }

  state.child.stdout.on('data', (data) => {
    const text = `${getTimestamp()} ${data.toString()}`;
    buffer.forward(text);
    broadcast('message', text);
  });

  state.child.stderr.on('data', (data) => {
    const text = `${getTimestamp()} ${data.toString()}`;
    buffer.forward(text);
    broadcast('message', text);
  });

  state.child.on('close', (code) => {
    state.child = undefined;
    const message = `child process exited with code ${code}`;
    broadcast('message', message);
  });

  state.child.on('error', (error) => {
    state.child = undefined;
    const message = `Error spawning snapraid process: ${error.message}`;
    broadcast('message', message);
  });

  return res.status(200).json({
    message: `Started Command ${normalizedCommand}`,
  });
}
