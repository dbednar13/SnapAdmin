import { ServerConfig } from 'common';

export const DEFAULT_SERVER_PORT = 9153;

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  port: DEFAULT_SERVER_PORT,
  snapRaidConfigPath: undefined,
};

export enum PathType {
  Source = 'Source',
  Content = 'Content',
  Parity = 'Parity',
}
