## Plan: SSE Test Endpoint and Webapp Output UI

TL;DR - Replace the backend websocket-like test output flow with Server-Sent Events, wire the frontend to subscribe on load, add a UI button to start the test, and render live ping output.

**Steps**
1. Update backend state and SSE connection logic in `packages/backend/src/index.ts`.
   - Change `state` to store `child` and an array of SSE clients.
   - Implement `/api/connect` as a true SSE endpoint, setting `Content-Type: text/event-stream`, `Cache-Control: no-cache`, and `Connection: keep-alive`.
   - Keep each SSE response open, send an initial comment or event, and remove disconnected clients on `close`.
   - Add a helper to broadcast buffered output to all active SSE clients.
2. Change test process output handling in `packages/backend/src/actions/test.ts`.
   - Keep `postTest` as the endpoint that starts the ping process.
   - When child `stdout` or `stderr` emits, forward the text into the buffer and broadcast it via the SSE helper.
   - Preserve existing error handling for "already running" and return initial JSON from `/test`.
   - Optionally keep `getTest` as a JSON fallback for current buffer snapshot.
3. Update the frontend in `packages/webapp/src/App.tsx`.
   - Add `useState` fields for live `output`, SSE connection status, and last message/status.
   - In `useEffect`, create an `EventSource('/api/connect')` on mount.
   - Wire `onmessage` or `addEventListener('output', ...)` to append SSE text to the `output` state.
   - Close the EventSource on cleanup.
4. Add UI controls and output display.
   - Add a button that sends `POST /test` when clicked.
   - After the call, show the response `message` and optionally the returned `output` snapshot.
   - Render the live ping output in a scrollable `pre` or `code` block.
   - Keep the rest of the page layout intact while placing the button and output display in the main section.
5. Verify end-to-end behavior.
   - Confirm `/api/connect` opens an SSE stream and remains open.
   - Confirm button click hits `/test`, starts ping, and output appears in the UI.
   - Confirm the UI keeps receiving updates after page load and after starting the test.

**Relevant files**
- `packages/backend/src/index.ts` — implement SSE and manage SSE client connections.
- `packages/backend/src/actions/test.ts` — broadcast child output to SSE clients.
- `packages/webapp/src/App.tsx` — add EventSource subscription, button, and output display.

**Verification**
1. Start the backend and webapp locally.
2. Open the webapp and ensure there are no SSE-related console errors.
3. Click the new test button and verify ping output appears live in the page.
4. Refresh the page and verify the SSE connection reopens automatically.

**Decisions / assumptions**
- Use `/api/connect` as the SSE subscription endpoint and retain `/test` for POST-triggering the ping.
- The webapp will display live output from SSE rather than using a websocket library.
- Existing CORS settings are sufficient for local frontend/backend communication.
