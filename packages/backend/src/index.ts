import { ChildProcessWithoutNullStreams } from 'child_process';

import { CircularBuffer } from 'circle-buffer';
import cors from 'cors';
import express, { Request, Response } from 'express';

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

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to SnapAdmin API' });
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

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error(`❌ Failed to start backend server on port ${PORT}:`, err);
  process.exit(1);
});
