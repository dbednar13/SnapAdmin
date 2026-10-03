import * as fs from 'fs';

import { DEFAULT_SERVER_CONFIG, DEFAULT_SERVER_PORT } from '@constants';
import { ServerConfig } from 'common';
import YAML from 'yaml';

const configFile = process.cwd() + '/config.yaml';

export const getConfigFile = (): ServerConfig => {
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, YAML.stringify(DEFAULT_SERVER_CONFIG));
    return DEFAULT_SERVER_CONFIG;
  }

  const fileContent = fs.readFileSync(configFile, 'utf8');
  const configData: ServerConfig = YAML.parse(fileContent);

  if (!configData.port) {
    configData.port = DEFAULT_SERVER_PORT;
    console.warn(
      `Port not specified in config file. Using default port: ${DEFAULT_SERVER_PORT}`
    );
  }

  if (!configData.snapRaidConfigPath) {
    console.error(
      `SnapRaid config file path not specified in config file.  Assuming file located next to executable.  Path will need to be provided before further configurations can be made.`
    );
  }

  return configData;
};

export const saveConfigFile = (config: ServerConfig): void => {
  fs.writeFileSync(configFile, YAML.stringify(config));
};
