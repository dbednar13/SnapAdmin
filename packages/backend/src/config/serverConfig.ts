import * as fs from 'fs';

import { DEFAULT_SERVER_CONFIG } from '@constants';

import { ServerConfig } from '../types/serverConfigTypes';

const configFile = process.cwd() + '/config.json';

export const getConfigFile = (): ServerConfig => {
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_SERVER_CONFIG));
    return DEFAULT_SERVER_CONFIG;
  }

  const configData = fs.readFileSync(configFile, 'utf-8');
  return JSON.parse(configData);
};
