import test from 'ava'
import { exec, rmdir } from '../../lib/index.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

test('exec', async(t) => {
  t.is((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, ''), 'test');
})

test('rmdir without recursive', (t) => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'));
  t.is(output, "directory not empty")
})

test('rmdir with recursive', (t) => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'), {
    recursive: true
  });

  t.is(output, "ok");
})