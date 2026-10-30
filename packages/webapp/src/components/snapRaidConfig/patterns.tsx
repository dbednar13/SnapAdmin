import type { SnapRaidConfig } from 'common';

import type { ConfigUpdater } from './types';

interface PatternsProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function Patterns({ config, updateConfig }: PatternsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {(
        [
          {
            key: 'excludePatterns',
            label: 'Exclude patterns',
          },
          {
            key: 'includePatterns',
            label: 'Include patterns',
          },
        ] as const
      ).map(({ key, label }) => (
        <div key={key}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{label}</h2>
            <button
              type="button"
              onClick={() => updateConfig(key, [...config[key], ''])}
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
            >
              Add pattern
            </button>
          </div>
          <div className="space-y-2">
            {config[key].map((pattern, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
              >
                <input
                  aria-label={`${label} ${index + 1}`}
                  value={pattern}
                  onChange={(event) => {
                    const patterns = [...config[key]];
                    patterns[index] = event.target.value;
                    updateConfig(key, patterns);
                  }}
                  className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
                />
                <button
                  type="button"
                  aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                  title="Remove pattern"
                  onClick={() =>
                    updateConfig(
                      key,
                      config[key].filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                  className="rounded border border-gray-300 px-3 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
