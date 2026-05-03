import path from 'node:path';

export enum PathType {
  Source = 'Source',
  Content = 'Content',
  Parity = 'Parity',
}

export interface CoveragePath {
  fullPath: string;
  name: string;
  pathType: PathType;
}

export function getDirectoryPath(coveragePath: CoveragePath): string {
  if (coveragePath.pathType === PathType.Parity) {
    const dir = path.dirname(coveragePath.fullPath);
    return dir === '.' ? coveragePath.fullPath : dir;
  }

  return coveragePath.fullPath;
}
