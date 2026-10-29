import type { SnapRaidConfig } from 'common';

import { type ConfigUpdater, parseLines } from './types';

interface ContentProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function Content({ config, updateConfig }: ContentProps) {
  return (
    <div>
      <label
        htmlFor="content-files"
        className="mb-1 block text-sm font-semibold"
      >
        Content files
      </label>
      <textarea
        id="content-files"
        rows={5}
        value={config.contentFiles.join('\n')}
        onChange={(event) =>
          updateConfig('contentFiles', parseLines(event.target.value))
        }
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
      />
    </div>
  );
}
