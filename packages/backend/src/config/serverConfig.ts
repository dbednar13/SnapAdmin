import * as fs from 'fs';

import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_EXECUTABLE_PATH,
  DEFAULT_SERVER_CONFIG,
  DEFAULT_SERVER_PORT,
} from '@constants';

import { ServerConfig } from '../types/serverConfigTypes';

const configFile = process.cwd() + '/config.json';

export const getConfigFile = (): ServerConfig => {
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_SERVER_CONFIG));
    return DEFAULT_SERVER_CONFIG;
  }

  const configDataRaw = fs.readFileSync(configFile, 'utf-8');

  const configData = JSON.parse(configDataRaw);

  if (!configData.port) {
    configData.port = DEFAULT_SERVER_PORT;
    console.warn(
      `Port not specified in config file. Using default port: ${DEFAULT_SERVER_PORT}`
    );
  }

  if (!configData.configFilePath) {
    configData.configFilePath = DEFAULT_CONFIG_PATH;
    console.warn(
      `Config file path not specified in config file. Using default path: ${DEFAULT_CONFIG_PATH}`
    );
  }

  if (!configData.executablePath) {
    configData.executablePath = DEFAULT_EXECUTABLE_PATH;
    console.warn(
      `Executable path not specified in config file. Using default path: ${DEFAULT_EXECUTABLE_PATH}`
    );
  }

  return configData;
};

export const saveConfigFile = (config: ServerConfig): void => {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
