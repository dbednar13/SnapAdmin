import type { SnapRaidConfig } from 'common';

import { type ConfigUpdater, parseLines } from './types';

interface PatternsProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function Patterns({ config, updateConfig }: PatternsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <label
          htmlFor="exclude-patterns"
          className="mb-1 block text-sm font-semibold"
        >
          Exclude patterns
        </label>
        <textarea
          id="exclude-patterns"
          rows={5}
          value={config.excludePatterns.join('\n')}
          onChange={(event) =>
            updateConfig('excludePatterns', parseLines(event.target.value))
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
        />
      </div>
      <div>
        <label
          htmlFor="include-patterns"
          className="mb-1 block text-sm font-semibold"
        >
          Include patterns
        </label>
        <textarea
          id="include-patterns"
          rows={5}
          value={config.includePatterns.join('\n')}
          onChange={(event) =>
            updateConfig('includePatterns', parseLines(event.target.value))
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
        />
      </div>
    </div>
  );
}
