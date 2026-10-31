import type { SnapRaidConfig } from 'common';

import type { ConfigUpdater } from './types';

interface GeneralSettingsProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function GeneralSettings({
  config,
  updateConfig,
}: GeneralSettingsProps) {
  return (
    <fieldset className="grid gap-4 border-t border-gray-200 pt-5 md:grid-cols-3 dark:border-neutral-700">
      <legend className="text-sm font-semibold">General settings</legend>
      <div>
        <label htmlFor="block-size" className="mb-1 block text-sm font-medium">
          Block size (KB)
        </label>
        <input
          id="block-size"
          type="number"
          min={32}
          max={16384}
          value={config.blockSizeKB}
          onChange={(event) =>
            updateConfig('blockSizeKB', Number(event.target.value))
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
        />
      </div>
      <div>
        <label htmlFor="auto-save" className="mb-1 block text-sm font-medium">
          Autosave (GB)
        </label>
        <input
          id="auto-save"
          type="number"
          min={10}
          max={32767}
          value={config.autoSaveGB}
          onChange={(event) =>
            updateConfig('autoSaveGB', Number(event.target.value))
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
        />
      </div>
      <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={config.nohidden}
          onChange={(event) => updateConfig('nohidden', event.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
        Exclude hidden files
      </label>
    </fieldset>
  );
}
