import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { CircularBuffer } from 'circle-buffer';
import { Request, Response } from 'express';

export function postTest(
  child: ChildProcessWithoutNullStreams | undefined,
  buffer: CircularBuffer,
  req: Request,
  res: Response
) {
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

  if (child) {
    return res.status(400).json({
      message:
        'A ping process is already running. Please stop it before starting a new one.',
    });
  }

  child = spawn('ping', ['-t', '-4', 'google.com']);

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
  });

  res.json({ message: 'Test endpoint', output: buffer.current() });
}

export function getTest(
  child: ChildProcessWithoutNullStreams | undefined,
  buffer: CircularBuffer,
  req: Request,
  res: Response
) {
  /*
   * In Node.js, HTTP requests and responses are inherently streams, making it efficient to stream data in chunks using chunked transfer encoding. This approach prevents memory overload by processing data incrementally, which is essential for handling large files or real-time data. 

Streaming Data from a Node.js Server
Piping Streams: The http module allows piping readable streams directly to the writable response object, ideal for streaming files.
Manual Writing: Use res.write() to send data incrementally for dynamic content, and res.end() to complete the response. 
https://dev.to/bsorrentino/how-to-stream-data-over-http-using-node-and-fetch-api-4ij2#:~:text=What%20is%20HTTP%20streaming?,the%20server%20and%20the%20client.
https://oneuptime.com/blog/post/2026-01-09-nodejs-streams-complete-guide/view#:~:text=import%20%7B%20createReadStream%20%7D%20from%20'fs,flows%20directly%20to%20response%20%7D);

Consuming a Streamed HTTP Response 
Events: Use res.on('data', ...) and res.on('end', ...) to handle incoming data chunks.
Piping Input: Pipe the incoming response stream directly to a destination, such as a file stream. 
https://stackoverflow.com/questions/71534322/http-stream-using-axios-node-js
https://stackoverflow.com/questions/19580305/node-js-http-response-streams
   */
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
