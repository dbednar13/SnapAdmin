import path from 'path';

import { PathType } from '@constants';
import { CoveragePath } from '@types';

export function getDirectoryPath(coveragePath: CoveragePath): string {
  if (coveragePath.pathType === PathType.Parity) {
    const dir = path.dirname(coveragePath.fullPath);
    return dir === '.' ? coveragePath.fullPath : dir;
  }

  return coveragePath.fullPath;
}
