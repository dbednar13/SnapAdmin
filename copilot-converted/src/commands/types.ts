export type SnapRaidCommand =
  | 'status'
  | 'diff'
  | 'dup'
  | 'sync'
  | 'scrub'
  | 'check'
  | 'fix';

export interface StdOptions {
  verbose?: boolean;
  logFile?: string;
  errorLimit?: number;
  start?: number;
  count?: number;
  quiet?: boolean;
}

export interface CheckOptions extends StdOptions {
  filter?: string;
  filterDisk?: string;
  filterMissing?: boolean;
  filterError?: boolean;
  auditOnly?: boolean;
  importPath?: string;
  forceUuid?: boolean;
  forceNoCopy?: boolean;
}

export interface DiffOptions extends StdOptions {}

export interface DupOptions extends StdOptions {}

export interface FixOptions extends StdOptions {
  filter?: string;
  filterDisk?: string;
  filterMissing?: boolean;
  filterError?: boolean;
  importPath?: string;
  forceUuid?: boolean;
  forceDevice?: boolean;
  forceNoCopy?: boolean;
}

export interface ScrubOptions extends StdOptions {
  plan?: string;
  olderThan?: number;
}

export interface StatusOptions extends StdOptions {}

export interface SyncOptions extends StdOptions {
  preHash?: boolean;
  forceZero?: boolean;
  forceEmpty?: boolean;
  forceUuid?: boolean;
  forceNoCopy?: boolean;
  forceFull?: boolean;
  forceRealloc?: boolean;
}

export type CommandOptionsMap = {
  status: StatusOptions;
  diff: DiffOptions;
  dup: DupOptions;
  sync: SyncOptions;
  scrub: ScrubOptions;
  check: CheckOptions;
  fix: FixOptions;
};

export interface SnapRaidCommandRequest<
  T extends SnapRaidCommand = SnapRaidCommand,
> {
  executablePath: string;
  configFilePath: string;
  command: T;
  options?: CommandOptionsMap[T];
  executionSettings?: {
    findByNameInSync?: boolean;
  };
}
