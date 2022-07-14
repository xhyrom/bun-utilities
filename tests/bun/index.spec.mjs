import { expect, it } from 'bun:test';
import { exec, rmdir } from '../../lib/index.mjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

it('exec', async() => {
  expect((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, '')).toBe('test');
})

it('rmdir without recursive', () => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'));
  expect(output).toBe("directory not empty");
})

it('rmdir with recursive', () => {
  const path = join(__dirname, 'test');
  if (!existsSync(path)) mkdirSync(path);
  if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
  writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

  const output = rmdir(join(__dirname, 'test'), {
    recursive: true
  });

  expect(output).toBe("ok");
})