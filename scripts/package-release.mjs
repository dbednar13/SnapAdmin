import { spawnSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releasePackage = path.join(root, 'release', 'package');
const pnpmCli = process.env.npm_execpath;
const pnpmIsExecutable = pnpmCli?.toLowerCase().endsWith('.exe');

if (!pnpmCli) {
  throw new Error('Run this script through pnpm package:release.');
}

const runPnpm = (args, cwd = root) => {
  const command = pnpmIsExecutable ? pnpmCli : process.execPath;
  const commandArgs = pnpmIsExecutable ? args : [pnpmCli, ...args];
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

rmSync(releasePackage, { recursive: true, force: true });

runPnpm(['build']);
runPnpm(['--filter', 'backend', 'deploy', '--prod', 'release/package']);

rmSync(path.join(releasePackage, 'node_modules'), {
  recursive: true,
  force: true,
});

runPnpm(
  [
    '--dir',
    releasePackage,
    'install',
    '--prod',
    '--frozen-lockfile',
    '--node-linker=hoisted',
  ],
  root,
);

cpSync(
  path.join(releasePackage, 'node_modules'),
  path.join(releasePackage, 'dist', 'node_modules'),
  { recursive: true, force: true },
);

console.log(
  `Unzipped release package staged at ${path.join(releasePackage, 'dist')}`,
);
