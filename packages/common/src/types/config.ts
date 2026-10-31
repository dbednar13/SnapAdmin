export type ServerConfig = {
  port: number;
  snapRaidConfigPath: string | undefined;
};

export interface SnapShotSource {
  name: string;
  dirSource: string;
}

export interface SnapRaidConfig {
  parityFile1: string;
  parityFile2?: string;
  parityFile3?: string;
  parityFile4?: string;
  parityFile5?: string;
  parityFile6?: string;
  readonly contentFiles: string[];
  readonly snapShotSources: SnapShotSource[];
  readonly excludePatterns: string[];
  readonly includePatterns: string[];
  blockSizeKB: number;
  autoSaveGB: number;
  nohidden: boolean;
}

export interface SnapRaidConfigWithValidation extends SnapRaidConfig {
  configErrors: string[];
  configWarnings: string[];
}
