import { ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

import { CircularBuffer } from 'circle-buffer';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { executeCommand } from './actions';
import { postTest, stopTest } from './actions/test';
import {
  ConfigFileOperationError,
  readConfigFile,
  writeConfigFile,
} from './config';
import { getConfigFile, saveConfigFile } from './config/serverConfig';

const app = express();

const config = getConfigFile();

const state: {
  child: ChildProcessWithoutNullStreams | undefined;
  clients: Response[];
} = {
  child: undefined,
  clients: [],
};

const buffer = new CircularBuffer({ limit: 5000 });

const broadcastSSE = (event: string, data: string) => {
  state.clients = state.clients.filter((client) => {
    try {
      client.write(`event: ${event}\n`);
      client.write(`data: ${data.replace(/\n/g, '\ndata: ')}\n\n`);
      return true;
    } catch {
      return false;
    }
  });
};

const sendSSE = (res: Response, event: string, data: string) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${data.replace(/\n/g, '\ndata: ')}\n\n`);
};

// Middleware
app.use(cors());
app.use(express.json());

// ========= Routes =========

// Connection endpoint to subscribe to console output
app.get('/api/connect', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  res.write(': connected\n\n');

  if (buffer.current()) {
    sendSSE(res, 'initial', buffer.current());
  }

  state.clients.push(res);

  req.on('close', () => {
    state.clients = state.clients.filter((client) => client !== res);
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req: Request, res: Response) => {
  postTest(state, buffer, req, res, broadcastSSE);
});

app.post('/api/stop', (req: Request, res: Response) => {
  stopTest(state, buffer, req, res, broadcastSSE);
});

app.post('/api/execute', (req: Request, res: Response) => {
  executeCommand(state, buffer, req, res, broadcastSSE);
});

app.get('/api/config', (req: Request, res: Response) => {
  res.json(getConfigFile());
});

app.post('/api/config', (req: Request, res: Response) => {
  const newConfig = req.body;
  saveConfigFile(newConfig);
  res.json({ message: 'Config updated successfully' });
});

app.get('/api/snapConfig', (req: Request, res: Response) => {
  try {
    return res.json(readConfigFile());
  } catch (error) {
    if (error instanceof ConfigFileOperationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Failed to read SnapRAID config.' });
  }
});

app.post('/api/snapConfig', (req: Request, res: Response) => {
  try {
    writeConfigFile(req.body);
    return res.json({ message: 'SnapRAID config updated successfully.' });
  } catch (error) {
    if (error instanceof ConfigFileOperationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: 'Failed to write SnapRAID config.' });
  }
});

// ========= UI Hosting Server ======== //
app.use(express.static(path.join(__dirname, './webapp')));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, './webapp/index.html'));
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

server.on('error', (err) => {
  console.error(`❌ Failed to start server on port ${config.port}:`, err);
  process.exit(1);
});
