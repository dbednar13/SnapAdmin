import type { SnapRaidConfig } from 'common';

export type ConfigUpdater = <K extends keyof SnapRaidConfig>(
  key: K,
  value: SnapRaidConfig[K]
) => void;

export const parseLines = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
