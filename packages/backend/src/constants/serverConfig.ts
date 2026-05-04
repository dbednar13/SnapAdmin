import { ServerConfig } from '@types';

export const DEFAULT_SERVER_PORT = 3000;
export const DEFAULT_EXECUTABLE_PATH = `${process.cwd()}/snapraid.exe`;
export const DEFAULT_CONFIG_PATH = `${process.cwd()}/snapraid.conf`;

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  port: DEFAULT_SERVER_PORT,
  executablePath: DEFAULT_EXECUTABLE_PATH,
  configFilePath: DEFAULT_CONFIG_PATH,
};
