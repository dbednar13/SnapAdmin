const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const packageDirectory = path.resolve(__dirname, '..');
const sourcePath = path.join(packageDirectory, 'config.yaml');
const destinationPath = path.join(packageDirectory, 'dist', 'config.yaml');
const config = YAML.parse(fs.readFileSync(sourcePath, 'utf8'));

config.snapRaidConfigPath = '';
fs.writeFileSync(destinationPath, YAML.stringify(config));
