import test from 'ava'
import { exec, rmdir, copydir } from '../../lib/index.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const urlPathName = new URL('.', import.meta.url).pathname;
const __dirname = process.platform === 'win32' ? urlPathName.slice(1) : urlPathName;

test('exec', async(t) => {
  t.is((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, ''), 'test');
});

test('rmdir without recursive', (t) => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: 'Hello, bun!' }));

  const output = rmdir(join(__dirname, 'test'));
  t.is(output, 'directory not empty')
});

test('rmdir with recursive', (t) => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: 'Hello, bun!' }));

  const output = rmdir(join(__dirname, 'test'), {
    recursive: true
  });

  t.is(output, 'ok');
});

test('copydir without recursive', (t) => {
  const path = join(__dirname, 'test-copydir');
  const pathDestination = join(__dirname, 'test-copydir-destination');
  if (!existsSync(path)) mkdirSync(path);
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: 'Hello, bun!' }));

  if (!existsSync(pathDestination)) mkdirSync(pathDestination);
  writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: 'Hello, bun! without recursive' }));

  copydir(path, pathDestination);

  const file = Buffer.from(readFileSync(join(pathDestination, 'test.json')).toString()).toString('base64');
  t.is(file, Buffer.from(JSON.stringify({ message: 'Hello, bun! without recursive' })).toString('base64'));
});

test('copydir with recursive', (t) => {
  const path = join(__dirname, 'test-copydir');
  const pathDestination = join(__dirname, 'test-copydir-destination');
  if (!existsSync(path)) mkdirSync(path);
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: 'Hello, bun!' }));

  if (!existsSync(pathDestination)) mkdirSync(pathDestination);
  writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: 'Hello, bun! without recursive' }));

  copydir(path, pathDestination, {
    recursive: true
  });

  const file = Buffer.from(readFileSync(join(pathDestination, 'test.json')).toString()).toString('base64');
  t.is(file, Buffer.from(JSON.stringify({ message: 'Hello, bun!' })).toString('base64'));
});

it('copyfile', (t) => {
  const path = join(__dirname, 'test-copyfile');
  const pathDestination = join(__dirname, 'test-copyfile-destination');

  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(pathDestination)) mkdirSync(pathDestination);

  const testEmptyPath = join(path, 'test-empty.txt');
  const testEmptyPathDestination = join(pathDestination, 'test-empty.txt');

  writeFileSync(testEmptyPath, '');
  t.is(copyfile(testEmptyPath, testEmptyPathDestination), 'ok');
});
