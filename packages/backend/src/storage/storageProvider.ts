import path from 'path';

export interface StorageProvider {
  getPathRoot(inputPath: string): string;
  getDriveSizes(paths: readonly string[]): number[];
}

export class BasicStorageProvider implements StorageProvider {
  public getPathRoot(inputPath: string): string {
    const parsed = path.parse(path.resolve(inputPath));
    return parsed.root || path.resolve(inputPath);
  }

  public getDriveSizes(paths: readonly string[]): number[] {
    const sizes: number[] = [];

    for (const source of paths) {
      const parts = source
        .split(',')
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);

      if (parts.length === 0) {
        continue;
      }

      // Initial migration phase intentionally avoids platform-specific drive size probes.
      sizes.push(0);
    }

    if (sizes.length === 0) {
      sizes.push(0);
    }

    return sizes;
  }
}
