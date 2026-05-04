export interface StorageDevice {
  caption: string;
  deviceId: string;
  driveType: string;
  driveLetter: string;
  name: string;
  fileSystem: string;
  capacity: number;
  freeSpace: number;
  status: string;
}

export interface StorageProvider {
  getPathRoot(inputPath: string): string;
  getDriveSizes(paths: readonly string[]): number[];
}
