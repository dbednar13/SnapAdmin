import { spawn } from 'node:child_process';
import { buildSnapRaidArgs } from './buildArgs.js';
import { SnapRaidCommand, SnapRaidCommandRequest } from './types.js';
import {
  createFullDirectoryPath,
  formatSnapRaidCommandArgs,
} from '../utils/util.js';

export interface CommandExecutionResult {
  code: number | null;
  stdout: string;
  stderr: string;
  executablePath: string;
  spawnedArgs: string[];
  formattedCommand: string;
}

function normalizeLogPath(logPath: string): string {
  const trimmed = logPath.trim();
  if (trimmed.startsWith('>>')) {
    return trimmed.slice(2).trim();
  }

  return trimmed;
}

export function executeSnapRaidCommand<T extends SnapRaidCommand>(
  request: SnapRaidCommandRequest<T>,
): Promise<CommandExecutionResult> {
  return new Promise((resolve, reject) => {
    const args = buildSnapRaidArgs(request);

    const possibleLogPath = request.options?.logFile;
    if (possibleLogPath) {
      createFullDirectoryPath(normalizeLogPath(possibleLogPath));
    }

    const formatted = formatSnapRaidCommandArgs(request.command, {
      snapRaidFileLocation: request.executablePath,
      configFileLocation: request.configFilePath,
      useVerboseMode: request.options?.verbose,
      findByNameInSync: request.executionSettings?.findByNameInSync,
    });

    const child = spawn(request.executablePath, args, {
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        executablePath: request.executablePath,
        spawnedArgs: args,
        formattedCommand: `${formatted.appPath}${formatted.args}`,
      });
    });
  });
}
