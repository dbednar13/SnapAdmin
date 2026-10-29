/*
 * Basic AI-Generated Unit tests to confirm that the config file helper is working as expected.
 * These tests are not exhaustive, but they do provide a basic level of confidence that the helper is functioning correctly.
 * They also serve as a starting point for more comprehensive testing in the future.
 *
 * The tests use my own SnapRAID.conf file as a fixture, to validate a real-world config file.
 */
import fs from 'fs';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

type ConfigFileHelperModule =
  typeof import('../src/config/configFileHelper.js');
type ConfigOperationsModule = typeof import('../src/config/index.js');

const originalWorkingDirectory = process.cwd();
const fixturePath = path.resolve('test/fixtures/SnapRAID.conf');
let temporaryDirectory: string;
let copiedConfigPath: string;
let ConfigFileHelper: ConfigFileHelperModule['ConfigFileHelper'];
let configOperations: ConfigOperationsModule;

before(async () => {
  temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'snapraid-config-tests-')
  );
  copiedConfigPath = path.join(temporaryDirectory, 'SnapRAID.conf');
  fs.copyFileSync(fixturePath, copiedConfigPath);
  fs.writeFileSync(
    path.join(temporaryDirectory, 'config.yaml'),
    `port: 9153\nsnapRaidConfigPath: "${copiedConfigPath.replace(/\\/g, '/')}"\n`
  );
  process.chdir(temporaryDirectory);

  ({ ConfigFileHelper } = await import('../src/config/configFileHelper.js'));
  configOperations = await import('../src/config/index.js');
});

after(() => {
  process.chdir(originalWorkingDirectory);
  fs.rmSync(temporaryDirectory, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 100,
  });
});

test('reads the attached SnapRAID config values', () => {
  const config = new ConfigFileHelper();

  config.read();

  assert.equal(config.parityFile1, 'A:\\\\snapraid.parity');
  assert.equal(config.parityFile2, 'B:\\\\snapraid-2.parity');
  assert.equal(config.contentFiles.length, 11);
  assert.equal(config.snapShotSources.length, 11);
  assert.equal(config.excludePatterns.length, 16);
  assert.equal(config.blockSizeKB, 256);
  assert.equal(config.autoSaveGB, 10000);
  assert.equal(config.nohidden, false);
  assert.deepEqual(
    config.snapShotSources.map((source) => source.name),
    Array.from({ length: 11 }, (_, index) => `d${index + 1}`)
  );
  assert.ok(Array.isArray(config.configErrors));
});

test('updates the configured copy and writes a timestamped backup', () => {
  const originalConfig = configOperations.readConfigFile();
  const updatedConfig = {
    ...originalConfig,
    parityFile1: 'C:\\snapraid-updated.parity',
    contentFiles: [
      path.join(temporaryDirectory, 'content-1'),
      path.join(temporaryDirectory, 'content-2'),
      path.join(temporaryDirectory, 'content-3'),
    ],
    snapShotSources: [{ name: 'd1', dirSource: temporaryDirectory }],
    autoSaveGB: 2048,
    nohidden: true,
  };
  const writeOrder: string[] = [];
  const copyCalls: Array<{ source: string; destination: string }> = [];
  const writes: Array<{ filePath: string; contents: string }> = [];
  const originalCopyFileSync = fs.copyFileSync;
  const originalWriteFileSync = fs.writeFileSync;
  const originalMkdirSync = fs.mkdirSync;

  fs.copyFileSync = ((source, destination) => {
    writeOrder.push('backup');
    copyCalls.push({
      source: String(source),
      destination: String(destination),
    });
  }) as typeof fs.copyFileSync;
  fs.writeFileSync = ((filePath, contents) => {
    writeOrder.push('write');
    writes.push({ filePath: String(filePath), contents: String(contents) });
  }) as typeof fs.writeFileSync;
  fs.mkdirSync = (() => undefined) as typeof fs.mkdirSync;

  try {
    configOperations.writeConfigFile(updatedConfig);
  } finally {
    fs.copyFileSync = originalCopyFileSync;
    fs.writeFileSync = originalWriteFileSync;
    fs.mkdirSync = originalMkdirSync;
  }

  const now = new Date();
  const timestamp = [
    now.getFullYear().toString().padStart(4, '0'),
    (now.getMonth() + 1).toString().padStart(2, '0'),
    now.getDate().toString().padStart(2, '0'),
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
  ].join('');
  const configuredPath = copiedConfigPath.replace(/\\/g, '/');

  assert.deepEqual(writeOrder, ['backup', 'write']);
  assert.deepEqual(copyCalls, [
    {
      source: configuredPath,
      destination: `${configuredPath}.${timestamp}`,
    },
  ]);
  assert.equal(writes.length, 1);
  assert.equal(writes[0]?.filePath, configuredPath);
  assert.match(
    writes[0]?.contents ?? '',
    /parity C:\\snapraid-updated\.parity/
  );
  assert.match(writes[0]?.contents ?? '', /autosave 2048/);
  assert.match(writes[0]?.contents ?? '', /nohidden\n/);
  assert.match(writes[0]?.contents ?? '', /exclude \*\.covefs/);
});

test('returns validation errors without backing up or writing invalid input', () => {
  const invalidConfig = {
    ...configOperations.readConfigFile(),
    blockSizeKB: 1,
    contentFiles: [
      path.join(temporaryDirectory, 'content-1'),
      path.join(temporaryDirectory, 'content-2'),
    ],
    snapShotSources: [{ name: 'd1', dirSource: temporaryDirectory }],
  };
  const originalCopyFileSync = fs.copyFileSync;
  const originalWriteFileSync = fs.writeFileSync;
  let backupCalled = false;
  let writeCalled = false;

  fs.copyFileSync = (() => {
    backupCalled = true;
  }) as typeof fs.copyFileSync;
  fs.writeFileSync = (() => {
    writeCalled = true;
  }) as typeof fs.writeFileSync;

  try {
    assert.throws(
      () => configOperations.writeConfigFile(invalidConfig),
      (error: unknown) =>
        error instanceof configOperations.ConfigFileOperationError &&
        error.statusCode === 400 &&
        error.message.includes('block_size must be between')
    );
  } finally {
    fs.copyFileSync = originalCopyFileSync;
    fs.writeFileSync = originalWriteFileSync;
  }

  assert.equal(backupCalled, false);
  assert.equal(writeCalled, false);
});
