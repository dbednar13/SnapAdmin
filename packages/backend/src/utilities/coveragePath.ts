import path from 'path';

export function getDirectoryPath(coveragePath: CoveragePath): string {
  if (coveragePath.pathType === PathType.Parity) {
    const dir = path.dirname(coveragePath.fullPath);
    return dir === '.' ? coveragePath.fullPath : dir;
  }

  return coveragePath.fullPath;
}
