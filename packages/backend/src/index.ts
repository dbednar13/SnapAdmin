import { spawn } from 'child_process';
import cors from 'cors';
import express, { Request, Response } from 'express';

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

app.post('/test', (req: Request, res: Response) => {
  /*
   * Test notes.
   * This is working as I'd want it to.
   * The ping spawns off and runs in the background, and the output is collected and printed to the console.
   * The response is sent back immediately with the message and the output collected so far (which may be empty at that point).
   * The ping continues to run and print output to the console until it is manually stopped or the server is restarted.
   *
   * To explore, move the child to a global scope, add endpoint can get the most recent output
   */
  console.log('Received test request with body:', req.body);

  const child = spawn('ping', ['-t', '-4', 'google.com']);
  let output = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`stdout: ${output}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.json({ message: 'Test endpoint', output });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error(`❌ Failed to start backend server on port ${PORT}:`, err);
  process.exit(1);
});
