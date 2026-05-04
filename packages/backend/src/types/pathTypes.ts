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
