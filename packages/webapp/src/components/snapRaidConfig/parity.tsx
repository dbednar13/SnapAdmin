import type { SnapRaidConfig } from 'common';

import type { ConfigUpdater } from './types';

type ParityField =
  | 'parityFile1'
  | 'parityFile2'
  | 'parityFile3'
  | 'parityFile4'
  | 'parityFile5'
  | 'parityFile6';

const parityFields: { name: ParityField; label: string }[] = [
  { name: 'parityFile1', label: 'Parity file' },
  { name: 'parityFile2', label: 'Parity 2 file' },
  { name: 'parityFile3', label: 'Parity 3 file' },
  { name: 'parityFile4', label: 'Parity 4 file' },
  { name: 'parityFile5', label: 'Parity 5 file' },
  { name: 'parityFile6', label: 'Parity 6 file' },
];

interface ParityProps {
  config: SnapRaidConfig;
  updateConfig: ConfigUpdater;
}

export default function Parity({ config, updateConfig }: ParityProps) {
  return (
    <fieldset className="space-y-4 border-b border-gray-200 pb-6 dark:border-neutral-700">
      <legend className="mb-3 text-base font-semibold">Parity files</legend>
      <div className="grid gap-4 md:grid-cols-2">
        {parityFields.map(({ name, label }, index) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
              {index === 0 ? ' (required)' : ''}
            </label>
            <input
              id={name}
              value={config[name] ?? ''}
              required={index === 0}
              onChange={(event) => updateConfig(name, event.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
