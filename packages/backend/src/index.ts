import { ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

import { CircularBuffer } from 'circle-buffer';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { getTest, postTest, stopTest } from './actions';

const app = express();
const PORT = process.env.PORT || 3000;

const state: {
  child: ChildProcessWithoutNullStreams | undefined;
  clients: Response[];
} = {
  child: undefined,
  clients: [],
};

const buffer = new CircularBuffer({ limit: 500 });

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

app.post('/test', (req: Request, res: Response) => {
  postTest(state, buffer, req, res, broadcastSSE);
});

app.post('/stop', (req: Request, res: Response) => {
  stopTest(state, buffer, req, res, broadcastSSE);
});

app.get('/test', (req: Request, res: Response) => {
  getTest(state.child, buffer, req, res);
});

// ========= UI Hosting Server ======== //
app.use(express.static(path.join(__dirname, '../dist/webapp')));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/webapp/index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error(`❌ Failed to start backend server on port ${PORT}:`, err);
  process.exit(1);
});
