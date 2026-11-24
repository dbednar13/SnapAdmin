import { useEffect, useRef, useState } from 'react';

type OutputAreaProps = {
  commandMessage: string;
};

type OutputTone = 'warning' | 'error' | 'normal';

const appendOutputLine = (current: string, message: string) =>
  current && !current.endsWith('\n')
    ? `${current}\n${message}`
    : `${current}${message}`;

const getOutputTone = (line: string): OutputTone => {
  const withoutTimestamp = line
    .replace(
      /^\[?(?:\d{4}-\d{2}-\d{2}[T\s])?\d{1,2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?\]?\s*/,
      ''
    )
    .replace(/^\[?\d{1,2}:\d{2}:\d{2}\]?\s*/, '')
    .trimStart();

  if (
    withoutTimestamp.startsWith('WARNING!') ||
    withoutTimestamp.startsWith('WARN')
  ) {
    return 'warning';
  }

  if (
    withoutTimestamp.startsWith('ERROR!') ||
    withoutTimestamp.startsWith('ERROR')
  ) {
    return 'error';
  }

  return 'normal';
};

const OutputArea = ({ commandMessage }: OutputAreaProps) => {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Connecting...');

  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever text updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const source = new EventSource('/api/connect');

    source.onopen = () => {
      setStatus('Connected');
    };

    source.onmessage = (event) => {
      setOutput((current) => appendOutputLine(current, event.data));
    };

    source.addEventListener('initial', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => appendOutputLine(current, message));
    });

    source.addEventListener('output', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => appendOutputLine(current, message));
    });

    source.onerror = () => {
      setStatus('Reconnecting...');
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <section className="mb-6 mt-6 rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800/80">
      <div className="flex flex-col gap-3">
        <div className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
          <div>Status: {status}</div>
          <div>{commandMessage}</div>
        </div>

        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          className="h-56 w-full overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-3 text-left text-sm font-mono text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {output.split('\n').map((line, index) => {
            const tone = getOutputTone(line);
            const toneClass =
              tone === 'warning'
                ? 'text-amber-700 dark:text-amber-300'
                : tone === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : '';

            return (
              <div
                key={`${index}-${line}`}
                className={`min-h-5 text-left whitespace-pre-wrap wrap-break-word ${toneClass}`}
              >
                {line || '\u00a0'}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OutputArea;
