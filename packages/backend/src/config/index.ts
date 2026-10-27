/*
 * Code for configuration file related operations.
 */
import fs from 'fs';

import {
  ConfigFileHelper,
  SnapRaidConfig,
  SnapRaidConfigWithValidation,
} from './configFileHelper.js';
import { getConfigFile } from './serverConfig.js';

export class ConfigFileOperationError extends Error {
  public constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

const isSnapRaidConfig = (value: unknown): value is SnapRaidConfig => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const config = value as Record<string, unknown>;
  const isStringArray = (items: unknown): items is string[] =>
    Array.isArray(items) && items.every((item) => typeof item === 'string');
  const isSnapshotSourceArray = (items: unknown): boolean =>
    Array.isArray(items) &&
    items.every(
      (source) =>
        typeof source === 'object' &&
        source !== null &&
        typeof source.name === 'string' &&
        typeof source.dirSource === 'string'
    );

  return (
    typeof config.parityFile1 === 'string' &&
    [
      'parityFile2',
      'parityFile3',
      'parityFile4',
      'parityFile5',
      'parityFile6',
    ].every(
      (field) =>
        config[field] === undefined || typeof config[field] === 'string'
    ) &&
    isStringArray(config.contentFiles) &&
    isSnapshotSourceArray(config.snapShotSources) &&
    isStringArray(config.excludePatterns) &&
    isStringArray(config.includePatterns) &&
    typeof config.blockSizeKB === 'number' &&
    Number.isFinite(config.blockSizeKB) &&
    typeof config.autoSaveGB === 'number' &&
    Number.isFinite(config.autoSaveGB) &&
    typeof config.nohidden === 'boolean'
  );
};

export function readConfigFile(): SnapRaidConfigWithValidation {
  const config = new ConfigFileHelper();
  config.read();
  return config.getSnapRaidConfig();
}

export function writeConfigFile(input: SnapRaidConfig): void {
  const configPath = getConfigFile().snapRaidConfigPath;
  if (!configPath) {
    throw new ConfigFileOperationError('SnapRAID config path is not set.', 400);
  }

  if (!isSnapRaidConfig(input)) {
    throw new ConfigFileOperationError(
      'Request body must match the SnapRaidConfig shape.',
      400
    );
  }

  const config = new ConfigFileHelper();
  config.read();
  config.parityFile1 = input.parityFile1;
  config.parityFile2 = input.parityFile2;
  config.parityFile3 = input.parityFile3;
  config.parityFile4 = input.parityFile4;
  config.parityFile5 = input.parityFile5;
  config.parityFile6 = input.parityFile6;
  config.contentFiles.splice(
    0,
    config.contentFiles.length,
    ...input.contentFiles
  );
  config.snapShotSources.splice(
    0,
    config.snapShotSources.length,
    ...input.snapShotSources
  );
  config.excludePatterns.splice(
    0,
    config.excludePatterns.length,
    ...input.excludePatterns
  );
  config.includePatterns.splice(
    0,
    config.includePatterns.length,
    ...input.includePatterns
  );
  config.blockSizeKB = input.blockSizeKB;
  config.autoSaveGB = input.autoSaveGB;
  config.nohidden = input.nohidden;

  if (fs.existsSync(configPath)) {
    const now = new Date();
    const timestamp = [
      now.getFullYear().toString().padStart(4, '0'),
      (now.getMonth() + 1).toString().padStart(2, '0'),
      now.getDate().toString().padStart(2, '0'),
      now.getHours().toString().padStart(2, '0'),
      now.getMinutes().toString().padStart(2, '0'),
    ].join('');

    try {
      fs.copyFileSync(configPath, `${configPath}.${timestamp}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown backup error';
      throw new ConfigFileOperationError(
        `Failed to back up SnapRAID config: ${message}`,
        500
      );
    }
  }

  const writeError = config.write(configPath);
  if (writeError) {
    throw new ConfigFileOperationError(writeError, 500);
  }
}
