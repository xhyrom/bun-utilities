import { expect, it } from 'bun:test';
import { exec, rmdir, copydir, copyfile } from '../../lib/index.mjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

it('exec - specific cwd', () => {
  expect(exec(['echo', 'test'], {
    cwd: resolve('..')
  }).stdout.replace(/\n|\r/g, '')).toBe('test');
});

it('exec - default cwd', () => {
  expect(exec(['echo', 'test']).stdout.replace(/\n|\r/g, '')).toBe('test');
});

it('rmdir - without recursive', () => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'));
  expect(output).toBe('directory not empty');
});

it('rmdir - with recursive', () => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'), {
    recursive: true
  });

  expect(output).toBe('ok');
});

it('copydir - without recursive', async() => {
  const path = join(__dirname, 'test-copydir');
  const pathDestination = join(__dirname, 'test-copydir-destination');
  if (!existsSync(path)) mkdirSync(path);
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  if (!existsSync(pathDestination)) mkdirSync(pathDestination);
  writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: "Hello, bun! without recursive" }));

  copydir(path, pathDestination);

  const file = Buffer.from(await Bun.file(join(pathDestination, 'test.json')).text()).toString('base64');
  expect(file).toBe(Buffer.from(JSON.stringify({ message: "Hello, bun! without recursive" })).toString('base64'));
});

it('copydir - with recursive', async() => {
  const path = join(__dirname, 'test-copydir');
  const pathDestination = join(__dirname, 'test-copydir-destination');
  if (!existsSync(path)) mkdirSync(path);
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  if (!existsSync(pathDestination)) mkdirSync(pathDestination);
  writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: "Hello, bun! without recursive" }));

  copydir(path, pathDestination, {
    recursive: true
  });

  const file = Buffer.from(await (await Bun.file(join(pathDestination, 'test.json')).text())).toString('base64');
  expect(file).toBe(Buffer.from(JSON.stringify({ message: "Hello, bun!" })).toString('base64'));
});

it('copyfile', () => {
  const path = join(__dirname, 'test-copyfile');
  const pathDestination = join(__dirname, 'test-copyfile-destination');

  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(pathDestination)) mkdirSync(pathDestination);

  const testEmptyPath = join(path, 'test-empty.txt');
  const testEmptyPathDestination = join(pathDestination, 'test-empty.txt');

  writeFileSync(testEmptyPath, '');
  expect(copyfile(testEmptyPath, testEmptyPathDestination)).toBe('ok');
});
