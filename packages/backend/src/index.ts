import { ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

import { CircularBuffer } from 'circle-buffer';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getTest, postTest } from './actions';

const app = express();
const PORT = process.env.PORT || 3000;

const state: { child: ChildProcessWithoutNullStreams | undefined } = {
  child: undefined,
};

const buffer = new CircularBuffer({ limit: 500 });

// Middleware
app.use(cors());
app.use(express.json());

// ========= Routes =========

// Connection endpoint to subscribe to console output
app.get('/api/connect', (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: 'Not implemented' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/test', (req: Request, res: Response) => {
  postTest(state.child, buffer, req, res);
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
