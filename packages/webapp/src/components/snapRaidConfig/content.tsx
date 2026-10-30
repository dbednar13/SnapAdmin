import type { SnapRaidConfig } from 'common';

import type { ConfigUpdater } from './types';

interface ContentProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function Content({ config, updateConfig }: ContentProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Content files</h2>
        <button
          type="button"
          onClick={() =>
            updateConfig('contentFiles', [...config.contentFiles, ''])
          }
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          Add file
        </button>
      </div>
      <div className="space-y-2">
        {config.contentFiles.map((file, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
          >
            <input
              aria-label={`Content file ${index + 1}`}
              value={file}
              onChange={(event) => {
                const files = [...config.contentFiles];
                files[index] = event.target.value;
                updateConfig('contentFiles', files);
              }}
              className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
            <button
              type="button"
              aria-label={`Remove content file ${index + 1}`}
              title="Remove content file"
              onClick={() =>
                updateConfig(
                  'contentFiles',
                  config.contentFiles.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
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
  );
}
