import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Connecting to SSE...');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    const source = new EventSource('/api/connect');

    source.onopen = () => {
      setStatus('Connected to SSE');
    };

    source.onmessage = (event) => {
      setOutput((current) =>
        current ? `${current}\n${event.data}` : event.data
      );
    };

    source.addEventListener('initial', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => (current ? `${current}\n${message}` : message));
    });

    source.addEventListener('output', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => (current ? `${current}\n${message}` : message));
    });

    source.onerror = () => {
      setStatus('SSE connection error');
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  const startTest = async () => {
    setTestMessage('Starting test...');

    try {
      const response = await fetch('/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setTestMessage(data.message || 'Test started');
      if (data.output) {
        setOutput((current) =>
          current ? `${current}\n${data.output}` : data.output
        );
      }
    } catch {
      setTestMessage('Failed to start test.');
    }
  };

  const stopTest = async () => {
    setTestMessage('Stopping test...');

    try {
      const response = await fetch('/api/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setTestMessage(data.message || 'Test stopped');
      if (data.output) {
        setOutput((current) =>
          current ? `${current}\n${data.output}` : data.output
        );
      }
    } catch {
      setTestMessage('Failed to stop test.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-900 text-slate-900 dark:text-neutral-100">
      <div className="w-full md:w-2/3 mx-auto">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-semibold">SnapAdmin</div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">
                  Admin UI placeholder
                </div>
              </div>
            </div>
            <nav className="space-x-4 text-sm text-gray-600 dark:text-neutral-300">
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                Link 1
              </button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                Link 2
              </button>
              <button className="px-3 py-1 rounded bg-indigo-600 text-white">
                Action
              </button>
            </nav>
          </div>
        </header>

        <main className="w-full px-4 py-6">
          <section className="mb-6">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
              Header pinned above; grid below shows placeholders.
            </p>
          </section>

          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-neutral-400">
                      Placeholder {i}
                    </div>
                    <div className="mt-2">
                      <button className="text-sm text-indigo-600 dark:text-neutral-300">
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 mt-6 rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800/80">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startTest}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Start Ping Test
                </button>
                <button
                  type="button"
                  onClick={stopTest}
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Stop Ping Test
                </button>
              </div>

              <div className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
                <div>SSE status: {status}</div>
                <div>{testMessage}</div>
              </div>

              <textarea
                readOnly
                value={output}
                className="min-h-56 w-full resize-none rounded-md border border-gray-300 bg-gray-50 p-3 text-sm font-mono text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
