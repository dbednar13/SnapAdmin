import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export interface SnapRaidCommandFormatSettings {
  snapRaidFileLocation: string;
  configFileLocation: string;
  useVerboseMode?: boolean;
  findByNameInSync?: boolean;
}

export interface SourcePathSpaceInfo {
  freeBytesAvailable: bigint;
  pathUsedBytes: bigint;
  rootBytesNotCoveredByPath: bigint;
}

function normalizePath(inputPath: string): string {
  return path
    .resolve(inputPath)
    .replace(/[\\/]+$/, '')
    .toUpperCase();
}

function getPathRoot(inputPath: string): string {
  return path.parse(path.resolve(inputPath)).root;
}

function dirSizeSync(directory: string): bigint {
  let total = 0n;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return 0n;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    try {
      if (entry.isDirectory()) {
        total += dirSizeSync(fullPath);
        continue;
      }

      if (entry.isFile()) {
        total += BigInt(fs.statSync(fullPath).size);
      }
    } catch {
      continue;
    }
  }

  return total;
}

function escapeUnescapedFilterBrackets(input: string): string {
  const openEscaped = input.replace(/(?<!\^)\[/g, '^[');
  return openEscaped.replace(/(?<!\^)\]/g, '^]');
}

export function createFullDirectoryPath(targetPath: string): void {
  if (!targetPath) {
    return;
  }

  const directory = path.dirname(targetPath);
  if (!directory || fs.existsSync(directory)) {
    return;
  }

  fs.mkdirSync(directory, { recursive: true });
}

export function formatSnapRaidCommandArgs(
  command: string,
  settings: SnapRaidCommandFormatSettings,
): { appPath: string; args: string } {
  let args = ' ';

  if (settings.useVerboseMode) {
    args += '-v ';
  }

  if (
    settings.findByNameInSync &&
    (command.startsWith('sync') ||
      command.startsWith('check') ||
      command.startsWith('fix'))
  ) {
    args += '-N ';
  }

  args += `-c "${settings.configFileLocation}" ${command}`;

  if (args.includes('-f ')) {
    args = escapeUnescapedFilterBrackets(args);
  }

  return {
    appPath: settings.snapRaidFileLocation,
    args,
  };
}

export function roundUpToDecimalPlace(
  numberToRound: number,
  decimalPlace: number,
): number {
  if (decimalPlace < 1) {
    return numberToRound;
  }

  const scale = Number.parseInt(`1${'0'.repeat(decimalPlace)}`, 10);
  return Math.ceil(numberToRound * scale) / scale;
}

export function computeSha1Hash(rawData: string): string {
  return crypto.createHash('sha1').update(rawData, 'utf8').digest('hex');
}

export function isExecutableRunning(executablePath: string): boolean {
  const fileName = path.basename(executablePath);
  if (!fileName) {
    return false;
  }

  const processName = fileName.replace(/\.[^.]+$/, '');

  if (process.platform === 'win32') {
    const output = spawnSync(
      'tasklist',
      ['/FI', `IMAGENAME eq ${processName}.exe`, '/FO', 'CSV', '/NH'],
      { encoding: 'utf8' },
    );

    if (output.status !== 0) {
      return false;
    }

    return output.stdout
      .toLowerCase()
      .includes(`${processName}.exe`.toLowerCase());
  }

  const output = spawnSync('pgrep', ['-x', processName], {
    encoding: 'utf8',
  });

  return output.status === 0 && output.stdout.trim().length > 0;
}

export function sourcePathFreeBytesAvailable(
  inputPath: string,
): SourcePathSpaceInfo {
  const fullPath = normalizePath(path.resolve(inputPath));
  const rootPathRaw = getPathRoot(inputPath);
  const rootPath = normalizePath(rootPathRaw);

  const stat = fs.statfsSync(rootPathRaw);
  const freeBytesAvailable = BigInt(Math.trunc(stat.bavail * stat.bsize));
  const totalBytes = BigInt(Math.trunc(stat.blocks * stat.bsize));
  const driveUsedBytes = totalBytes - freeBytesAvailable;

  if (rootPath === fullPath) {
    return {
      freeBytesAvailable,
      pathUsedBytes: driveUsedBytes,
      rootBytesNotCoveredByPath: 0n,
    };
  }

  const pathUsedBytes = dirSizeSync(inputPath);
  const rootBytesNotCoveredByPath =
    pathUsedBytes < driveUsedBytes ? driveUsedBytes - pathUsedBytes : 0n;

  return {
    freeBytesAvailable,
    pathUsedBytes,
    rootBytesNotCoveredByPath,
  };
}
