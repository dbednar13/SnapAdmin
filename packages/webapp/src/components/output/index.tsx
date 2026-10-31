import { useEffect, useRef, useState } from 'react';

type OutputAreaProps = {
  commandMessage: string;
};

const OutputArea = ({ commandMessage }: OutputAreaProps) => {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Connecting...');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the bottom whenever text updates
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const source = new EventSource('/api/connect');

    source.onopen = () => {
      setStatus('Connected');
    };

    source.onmessage = (event) => {
      setOutput((current) =>
        current ? `${current}${event.data}` : event.data
      );
    };

    source.addEventListener('initial', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => (current ? `${current}${message}` : message));
    });

    source.addEventListener('output', (event) => {
      const message = (event as MessageEvent).data;
      setOutput((current) => (current ? `${current}${message}` : message));
    });

    source.onerror = () => {
      setStatus('Connection Error');
      source.close();
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

        <textarea
          readOnly
          value={output}
          ref={textareaRef}
          className="min-h-56 w-full resize-none rounded-md border border-gray-300 bg-gray-50 p-3 text-sm font-mono text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
    </section>
  );
};

export default OutputArea;
