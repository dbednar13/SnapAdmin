import type { SnapRaidConfig } from 'common';

import type { ConfigUpdater } from './types';

interface DataSourcesProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function DataSources({
  config,
  updateConfig,
}: DataSourcesProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Data sources</h2>
        <button
          type="button"
          onClick={() =>
            updateConfig('snapShotSources', [
              ...config.snapShotSources,
              {
                name: `d${config.snapShotSources.length + 1}`,
                dirSource: '',
              },
            ])
          }
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          Add source
        </button>
      </div>
      <div className="mb-1 grid grid-cols-[minmax(4rem,0.3fr)_minmax(0,1fr)_auto] gap-2 text-xs font-medium text-gray-600 dark:text-neutral-400">
        <span>Disk</span>
        <span>Directory</span>
        <span className="sr-only">Actions</span>
      </div>
      <div className="space-y-2">
        {config.snapShotSources.map((source, index) => (
          <div
            key={`${source.name}-${index}`}
            className="grid grid-cols-[minmax(4rem,0.3fr)_minmax(0,1fr)_auto] gap-2"
          >
            <input
              aria-label={`Data source ${index + 1} name`}
              value={source.name}
              onChange={(event) => {
                const sources = [...config.snapShotSources];
                sources[index] = { ...source, name: event.target.value };
                updateConfig('snapShotSources', sources);
              }}
              className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
            <input
              aria-label={`Data source ${index + 1} path`}
              value={source.dirSource}
              onChange={(event) => {
                const sources = [...config.snapShotSources];
                sources[index] = { ...source, dirSource: event.target.value };
                updateConfig('snapShotSources', sources);
              }}
              className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
            <button
              type="button"
              aria-label={`Remove data source ${index + 1}`}
              title="Remove source"
              onClick={() =>
                updateConfig(
                  'snapShotSources',
                  config.snapShotSources.filter(
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
