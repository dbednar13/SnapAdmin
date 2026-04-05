import cors from 'cors';
import express, { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

import { getTest, postTest } from './actions';

const app = express();
const PORT = process.env.PORT || 3000;

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

if (process.env.NODE_ENV !== 'production') {
  const testRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: { message: 'Too many requests, please try again later.' },
  });

  app.post('/test', testRateLimit, (req: Request, res: Response) => {
    postTest(req, res);
  });

  app.get('/test', testRateLimit, (req: Request, res: Response) => {
    getTest(req, res);
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error(`❌ Failed to start backend server on port ${PORT}:`, err);
  process.exit(1);
});
