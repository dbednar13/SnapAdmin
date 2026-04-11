import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_AUTO_SAVE,
  DEFAULT_BLOCK_SIZE,
  MAX_AUTO_SAVE,
  MAX_BLOCK_SIZE,
  MIN_AUTO_SAVE,
  MIN_BLOCK_SIZE,
} from '../models/constants.js';
import { CoveragePath, PathType } from '../models/coveragePath.js';
import {
  BasicStorageProvider,
  StorageProvider,
} from '../storage/storageProvider.js';
import {
  SECTION_1,
  SECTION_10,
  SECTION_11,
  SECTION_2,
  SECTION_3,
  SECTION_4,
  SECTION_5,
  SECTION_6,
  SECTION_7,
  SECTION_8,
  SECTION_9,
} from './configSections.js';

export interface SnapShotSource {
  name: string;
  dirSource: string;
}

const VALID_CONFIG_NAMES = new Set([
  'parity',
  '2-parity',
  'q-parity',
  '3-parity',
  'z-parity',
  '4-parity',
  '5-parity',
  '6-parity',
  'content',
  'disk',
  'data',
  'nohidden',
  'exclude',
  'block_size',
  'hashsize',
  'autosave',
  'pool',
  'share',
  'smartctl',
]);

export class ConfigFileHelper {
  public static readonly CHECKBOX_DISPLAY_OUTPUT_ENABLED = 0;
  public static readonly CHECKBOX_USE_VERBOSE_MODE = 1;
  public static readonly CHECKBOX_FIND_BY_NAME_IN_SYNC = 2;
  public static readonly CHECKBOX_HIDDEN_FILES_EXCLUDED = 3;
  public static readonly CHECKBOX_DEBUG_LOGGING_ENABLED = 4;

  private readonly storageProvider: StorageProvider;

  private configPath: string | null = null;

  public configErrors: string[] = [];
  public configWarnings: string[] = [];

  public parityFile1 = '';
  public parityFile2 = '';
  public zParityFile = '';
  public parityFile3 = '';
  public parityFile4 = '';
  public parityFile5 = '';
  public parityFile6 = '';

  public readonly contentFiles: string[] = [];
  public readonly snapShotSources: SnapShotSource[] = [];
  public readonly excludePatterns: string[] = [];
  public readonly includePatterns: string[] = [];

  public blockSizeKB = DEFAULT_BLOCK_SIZE;
  public autoSaveGB = DEFAULT_AUTO_SAVE;
  public nohidden = false;

  public constructor(
    configPath?: string,
    storageProvider: StorageProvider = new BasicStorageProvider(),
  ) {
    this.storageProvider = storageProvider;

    if (configPath) {
      this.loadConfigFile(configPath);
    }
  }

  public get isValid(): boolean {
    return this.configFileExists && this.configErrors.length === 0;
  }

  public get hasErrors(): boolean {
    return this.configErrors.length > 0;
  }

  public get hasWarnings(): boolean {
    return this.configWarnings.length > 0;
  }

  public get configFileExists(): boolean {
    return this.configPath !== null && fs.existsSync(this.configPath);
  }

  public get dataSourcePaths(): readonly SnapShotSource[] {
    return [...this.snapShotSources];
  }

  public isNewSync(): boolean {
    for (const item of this.parityContentPaths) {
      if (fs.existsSync(item)) {
        return false;
      }
    }

    return true;
  }

  public loadConfigFile(configFile: string): void {
    this.configErrors.length = 0;
    this.configWarnings.length = 0;
    this.configPath = configFile;

    if (this.read()) {
      this.doValidation();
      return;
    }

    this.configErrors.push(
      `Failed to read the configuration file ${configFile}`,
    );
  }

  public read(): boolean {
    try {
      if (!this.configFileExists || this.configPath === null) {
        return false;
      }

      let isConfigRead = true;

      this.parityFile1 = '';
      this.parityFile2 = '';
      this.zParityFile = '';
      this.parityFile3 = '';
      this.parityFile4 = '';
      this.parityFile5 = '';
      this.parityFile6 = '';

      this.configErrors.length = 0;
      this.configWarnings.length = 0;

      this.contentFiles.length = 0;
      this.snapShotSources.length = 0;
      this.excludePatterns.length = 0;
      this.includePatterns.length = 0;

      this.blockSizeKB = DEFAULT_BLOCK_SIZE;
      this.autoSaveGB = DEFAULT_AUTO_SAVE;
      this.nohidden = false;

      const lines = fs.readFileSync(this.configPath, 'utf8').split(/\r?\n/);

      for (const rawLine of lines) {
        const lineStart = rawLine.trim();

        if (lineStart.length === 0 || lineStart.startsWith('#')) {
          continue;
        }

        const firstSpace = lineStart.indexOf(' ');
        const configItemName =
          firstSpace === -1 ? lineStart : lineStart.slice(0, firstSpace);
        const configItemValue =
          firstSpace === -1 ? '' : lineStart.slice(firstSpace + 1);

        if (!VALID_CONFIG_NAMES.has(configItemName)) {
          continue;
        }

        switch (configItemName) {
          case 'parity':
            this.parityFile1 = configItemValue;
            break;
          case 'q-parity':
            this.parityFile2 = configItemValue;
            break;
          case '2-parity':
            if (!this.parityFile2) {
              this.parityFile2 = configItemValue;
            }
            break;
          case 'z-parity':
            this.zParityFile = configItemValue;
            this.parityFile3 = '';
            break;
          case '3-parity':
            if (!this.zParityFile.trim()) {
              this.parityFile3 = configItemValue;
            }
            break;
          case '4-parity':
            this.parityFile4 = configItemValue;
            break;
          case '5-parity':
            this.parityFile5 = configItemValue;
            break;
          case '6-parity':
            this.parityFile6 = configItemValue;
            break;
          case 'content':
            this.contentFiles.push(configItemValue);
            break;
          case 'disk':
          case 'data': {
            const diskName = configItemValue.split(' ')[0] ?? '';
            const diskSplitIndex = configItemValue.indexOf(' ');
            const diskPath =
              diskSplitIndex >= 0
                ? configItemValue.slice(diskSplitIndex + 1)
                : '';

            if (diskName && diskPath) {
              this.snapShotSources.push({
                name: diskName,
                dirSource: diskPath,
              });
            }
            break;
          }
          case 'exclude':
            this.excludePatterns.push(configItemValue);
            break;
          case 'include':
            this.includePatterns.push(configItemValue);
            break;
          case 'block_size': {
            const parsed = Number.parseInt(configItemValue, 10);
            this.blockSizeKB = Number.isNaN(parsed) ? this.blockSizeKB : parsed;
            if (
              this.blockSizeKB < MIN_BLOCK_SIZE ||
              this.blockSizeKB > MAX_BLOCK_SIZE
            ) {
              isConfigRead = false;
            }
            break;
          }
          case 'autosave': {
            const parsed = Number.parseInt(configItemValue, 10);
            this.autoSaveGB = Number.isNaN(parsed) ? this.autoSaveGB : parsed;
            if (
              this.autoSaveGB < MIN_AUTO_SAVE ||
              this.autoSaveGB > MAX_AUTO_SAVE
            ) {
              isConfigRead = false;
            }
            break;
          }
          case 'nohidden':
            this.nohidden = true;
            break;
          default:
            break;
        }
      }

      return isConfigRead;
    } catch {
      return false;
    }
  }

  public getPathsOfInterest(): CoveragePath[] {
    const pathsOfInterest: CoveragePath[] = [];

    for (const source of this.dataSourcePaths) {
      pathsOfInterest.push({
        fullPath: path.resolve(source.dirSource),
        pathType: PathType.Source,
        name: source.name,
      });
    }

    this.addParityCoverage(pathsOfInterest, this.parityFile1, 'Parity1');
    this.addParityCoverage(pathsOfInterest, this.parityFile2, 'Parity2');
    this.addParityCoverage(pathsOfInterest, this.zParityFile, 'ZParity');
    this.addParityCoverage(pathsOfInterest, this.parityFile3, 'Parity3');
    this.addParityCoverage(pathsOfInterest, this.parityFile4, 'Parity4');
    this.addParityCoverage(pathsOfInterest, this.parityFile5, 'Parity5');
    this.addParityCoverage(pathsOfInterest, this.parityFile6, 'Parity6');

    return pathsOfInterest;
  }

  public write(targetFileName: string): string {
    try {
      const lines: string[] = [];

      lines.push(SECTION_1);

      lines.push(SECTION_2);
      this.addParityToConfig(lines, this.parityFile1);

      lines.push(SECTION_3);
      this.addParityToConfig(lines, this.parityFile2, '2');
      this.addParityToConfig(lines, this.zParityFile, 'z');
      this.addParityToConfig(lines, this.parityFile3, '3');
      this.addParityToConfig(lines, this.parityFile4, '4');
      this.addParityToConfig(lines, this.parityFile5, '5');
      this.addParityToConfig(lines, this.parityFile6, '6');

      lines.push(SECTION_4);
      for (const item of this.contentFiles) {
        const normalized =
          fs.existsSync(item) && fs.statSync(item).isDirectory()
            ? path.join(item, 'snapraid.content')
            : item;
        lines.push(`content ${normalized}`);
      }

      lines.push(SECTION_5);
      for (const source of this.snapShotSources) {
        lines.push(`disk ${source.name} ${source.dirSource}`);
      }

      lines.push(SECTION_6);
      lines.push(this.nohidden ? 'nohidden' : '#nohidden');

      lines.push(SECTION_7);
      for (const item of this.excludePatterns) {
        lines.push(`exclude ${item}`);
      }
      for (const item of this.includePatterns) {
        lines.push(`include ${item}`);
      }

      lines.push(SECTION_8);
      if (
        this.blockSizeKB < MIN_BLOCK_SIZE ||
        this.blockSizeKB > MAX_BLOCK_SIZE
      ) {
        this.blockSizeKB = DEFAULT_BLOCK_SIZE;
      }
      lines.push(`block_size ${this.blockSizeKB}`);

      lines.push(SECTION_9);

      lines.push(SECTION_10);
      if (this.autoSaveGB < MIN_AUTO_SAVE || this.autoSaveGB > MAX_AUTO_SAVE) {
        this.autoSaveGB = DEFAULT_AUTO_SAVE;
      }
      lines.push(`autosave ${this.autoSaveGB}`);

      lines.push(SECTION_11);

      const output = `${lines.join('\n')}\n`;
      const targetDir = path.dirname(targetFileName);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(targetFileName, output, 'utf8');
      return '';
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown write error';
    }
  }

  public static isRulePassPreviousCannotBeEmpty(
    previous: string | null,
    current: string,
  ): boolean {
    if (previous === null && current.length === 0) {
      return false;
    }

    return previous !== '' || current.length === 0;
  }

  public static isRulePassDevicesMustNotRepeat(
    paths: readonly string[] | null,
    current: string,
  ): boolean {
    if (!paths || !current) {
      return true;
    }

    const alreadyAdded = new Set<string>();

    for (const text of paths) {
      if (!text.trim()) {
        continue;
      }

      const possiblePaths = text.trim().split(',');
      for (const possiblePath of possiblePaths) {
        if (alreadyAdded.has(possiblePath)) {
          return false;
        }
        alreadyAdded.add(possiblePath);
      }
    }

    return true;
  }

  private get parityPaths(): string[] {
    return [
      this.parityFile1,
      this.parityFile2,
      this.zParityFile,
      this.parityFile3,
      this.parityFile4,
      this.parityFile5,
      this.parityFile6,
    ].filter((entry) => entry.length > 0);
  }

  private get parityContentPaths(): string[] {
    return [...this.parityPaths, ...this.contentFiles];
  }

  private doValidation(): void {
    if (!this.configPath) {
      this.configErrors.push(
        'Config validation failed. There is no config file set.',
      );
      return;
    }

    if (this.snapShotSources.length === 0) {
      this.configErrors.push(
        'At least one data source must be specified. Check the value for "d1" ',
      );
    }

    if (this.parityFile1.length === 0) {
      this.configErrors.push(
        'The first parity location must not be empty. Check the value for "parity"',
      );
    }

    if (this.contentFiles.length < this.parityPaths.length + 1) {
      this.configErrors.push(
        `The number of content files must be at least one greater than the number of parity files. There should be at least ${this.parityPaths.length + 1} content files.`,
      );
    }

    if (!this.isRulePassDevicesMustNotRepeatForSources(this.dataSourcePaths)) {
      this.configErrors.push(
        'Devices for Source and Parity must be unique. Check the values for data and parity',
      );
    }

    for (const source of this.dataSourcePaths) {
      if (!fs.existsSync(source.dirSource)) {
        this.configErrors.push(
          `Source is inaccessible or does not exist: ${source.dirSource}`,
        );
      }
    }

    const largestSourceDevice = Math.max(
      ...this.storageProvider.getDriveSizes(
        this.snapShotSources.map((s) => s.dirSource),
      ),
    );
    const smallestParityDevice = Math.min(
      ...this.storageProvider.getDriveSizes(this.parityPaths),
    );

    if (largestSourceDevice > smallestParityDevice) {
      this.configWarnings.push(
        `One or more data devices [${largestSourceDevice}] are larger than the smallest parity device [${smallestParityDevice}]. All parity devices should be equal or greater in size than all data devices.`,
      );
    }

    if (this.blockSizeKB < 1 || this.blockSizeKB > MAX_BLOCK_SIZE) {
      this.configErrors.push(
        'The blockSize value is invalid and must be between 1 and 16384',
      );
    }

    if (this.autoSaveGB > MAX_AUTO_SAVE) {
      this.configErrors.push(
        `The autoSave value is invalid and must be between ${MIN_AUTO_SAVE} and ${MAX_AUTO_SAVE}`,
      );
    }
  }

  private isRulePassDevicesMustNotRepeatForSources(
    sources: readonly SnapShotSource[],
  ): boolean {
    const roots: string[] = [];

    try {
      for (const source of sources) {
        let root = '';

        try {
          root = this.storageProvider.getPathRoot(source.dirSource);
        } catch {
          root = '';
        }

        if (roots.includes(root)) {
          return false;
        }

        roots.push(root);
      }
    } catch {
      return false;
    }

    return true;
  }

  private addParityCoverage(
    pathsOfInterest: CoveragePath[],
    parityPaths: string,
    parityName: string,
  ): void {
    if (!parityPaths.trim()) {
      return;
    }

    const parities = parityPaths
      .trim()
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    for (const parity of parities) {
      pathsOfInterest.push({
        fullPath: path.resolve(parity),
        pathType: PathType.Parity,
        name: parityName,
      });
    }
  }

  private addParityToConfig(
    lines: string[],
    parityPaths: string,
    offset: string | null = null,
  ): void {
    if (!parityPaths) {
      return;
    }

    const prefix = offset ? `${offset}-` : '';
    const parities = parityPaths
      .trim()
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    const expandedParities = parities.map((parity) => {
      if (fs.existsSync(parity) && fs.statSync(parity).isDirectory()) {
        return path.join(
          parity,
          `snapraid${offset ? `-${offset}` : ''}.parity`,
        );
      }

      return parity;
    });

    lines.push(`${prefix}parity ${expandedParities.join(',')}`);
  }
}
