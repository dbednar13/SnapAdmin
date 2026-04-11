import {
  CheckOptions,
  CommandOptionsMap,
  FixOptions,
  ScrubOptions,
  SnapRaidCommand,
  SnapRaidCommandRequest,
  StdOptions,
  SyncOptions,
} from './types.js';

function addFlag(
  args: string[],
  enabled: boolean | undefined,
  flag: string,
): void {
  if (enabled) {
    args.push(flag);
  }
}

function addValue(
  args: string[],
  value: string | number | undefined,
  flag: string,
): void {
  if (value === undefined || value === null || value === '') {
    return;
  }

  args.push(flag, String(value));
}

function appendStdOptions(args: string[], options: StdOptions): void {
  addFlag(args, options.verbose, '-v');
  addValue(args, options.logFile, '-l');
  addValue(args, options.errorLimit, '-L');
  addValue(args, options.start, '-S');
  addValue(args, options.count, '-B');
  addFlag(args, options.quiet, '-q');
}

function appendCommandSpecificOptions<T extends SnapRaidCommand>(
  args: string[],
  command: T,
  options: CommandOptionsMap[T] | undefined,
): void {
  if (!options) {
    return;
  }

  switch (command) {
    case 'check': {
      const checkOptions = options as CheckOptions;
      addValue(args, checkOptions.filter, '-f');
      addValue(args, checkOptions.filterDisk, '-d');
      addFlag(args, checkOptions.filterMissing, '-m');
      addFlag(args, checkOptions.filterError, '-e');
      addFlag(args, checkOptions.auditOnly, '-a');
      addValue(args, checkOptions.importPath, '-i');
      addFlag(args, checkOptions.forceUuid, '-U');
      addFlag(args, checkOptions.forceNoCopy, '-N');
      break;
    }
    case 'fix': {
      const fixOptions = options as FixOptions;
      addValue(args, fixOptions.filter, '-f');
      addValue(args, fixOptions.filterDisk, '-d');
      addFlag(args, fixOptions.filterMissing, '-m');
      addFlag(args, fixOptions.filterError, '-e');
      addValue(args, fixOptions.importPath, '-i');
      addFlag(args, fixOptions.forceUuid, '-U');
      addFlag(args, fixOptions.forceDevice, '-D');
      addFlag(args, fixOptions.forceNoCopy, '-N');
      break;
    }
    case 'scrub': {
      const scrubOptions = options as ScrubOptions;
      addValue(args, scrubOptions.plan, '-p');
      addValue(args, scrubOptions.olderThan, '-o');
      break;
    }
    case 'sync': {
      const syncOptions = options as SyncOptions;
      addFlag(args, syncOptions.preHash, '-h');
      addFlag(args, syncOptions.forceZero, '-Z');
      addFlag(args, syncOptions.forceEmpty, '-E');
      addFlag(args, syncOptions.forceUuid, '-U');
      addFlag(args, syncOptions.forceNoCopy, '-N');
      addFlag(args, syncOptions.forceFull, '-F');
      addFlag(args, syncOptions.forceRealloc, '-R');
      break;
    }
    case 'status':
    case 'diff':
    case 'dup':
      break;
    default:
      break;
  }
}

export function buildSnapRaidArgs<T extends SnapRaidCommand>(
  request: SnapRaidCommandRequest<T>,
): string[] {
  const args: string[] = [];
  const options = request.options ?? ({} as CommandOptionsMap[T]);

  appendStdOptions(args, options);
  args.push('-c', request.configFilePath);
  appendCommandSpecificOptions(args, request.command, options);
  args.push(request.command);

  return args;
}
