/*
 * Code for configuration file related operations.
 */
import fs from 'fs';

import {
  ConfigFileHelper,
  SnapRaidConfig,
  SnapShotSource,
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

export function readConfigFile(): SnapRaidConfig {
  const configPath = getConfigFile().snapRaidConfigPath;
  if (!configPath) {
    throw new ConfigFileOperationError('SnapRAID config path is not set.', 400);
  }

  const config = new ConfigFileHelper();
  if (!config.configFileExists) {
    throw new ConfigFileOperationError(
      'SnapRAID config file was not found.',
      404
    );
  }

  return config.getSnapRaidConfig();
}

export function writeConfigFile(input: unknown): void {
  const configPath = getConfigFile().snapRaidConfigPath;
  if (!configPath) {
    throw new ConfigFileOperationError('SnapRAID config path is not set.', 400);
  }

  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new ConfigFileOperationError('A config object is required.', 400);
  }

  const updates = input as Record<string, unknown>;
  const config = new ConfigFileHelper();
  const stringFields = [
    'parityFile1',
    'parityFile2',
    'parityFile3',
    'parityFile4',
    'parityFile5',
    'parityFile6',
  ] as const;

  for (const field of stringFields) {
    if (field in updates) {
      if (typeof updates[field] !== 'string') {
        throw new ConfigFileOperationError(`${field} must be a string.`, 400);
      }
      config[field] = updates[field] as string;
    }
  }

  const stringArrayFields = [
    ['contentFiles', config.contentFiles],
    ['excludePatterns', config.excludePatterns],
    ['includePatterns', config.includePatterns],
    ['extras', config.extras],
    ['tempLimits', config.tempLimits],
    ['tempSleeps', config.tempSleeps],
    ['pools', config.pools],
    ['shares', config.shares],
    ['smartctlCommands', config.smartctlCommands],
  ] as const;

  for (const [field, target] of stringArrayFields) {
    if (field in updates) {
      const value = updates[field];
      if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === 'string')
      ) {
        throw new ConfigFileOperationError(
          `${field} must be an array of strings.`,
          400
        );
      }
      target.splice(0, target.length, ...value);
    }
  }

  if ('snapShotSources' in updates) {
    const sources = updates.snapShotSources;
    if (
      !Array.isArray(sources) ||
      !sources.every(
        (source) =>
          typeof source === 'object' &&
          source !== null &&
          typeof source.name === 'string' &&
          typeof source.dirSource === 'string'
      )
    ) {
      throw new ConfigFileOperationError(
        'snapShotSources must contain name and dirSource strings.',
        400
      );
    }
    config.snapShotSources.splice(
      0,
      config.snapShotSources.length,
      ...(sources as SnapShotSource[])
    );
  }

  for (const field of ['blockSizeKB', 'autoSaveGB'] as const) {
    if (field in updates) {
      if (
        typeof updates[field] !== 'number' ||
        !Number.isFinite(updates[field])
      ) {
        throw new ConfigFileOperationError(`${field} must be a number.`, 400);
      }
      config[field] = updates[field] as number;
    }
  }

  if ('nohidden' in updates) {
    if (typeof updates.nohidden !== 'boolean') {
      throw new ConfigFileOperationError('nohidden must be a boolean.', 400);
    }
    config.nohidden = updates.nohidden;
  }

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
