import { expect, it } from 'bun:test';
import { exec, rmdir } from '../../lib/index.mjs';
import { mkdirSync } from 'fs';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

it('exec from native', async() => {
  expect((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, '')).toBe('test');
})

it('rmdir', () => {
  mkdirSync(join(__dirname, 'test'));
  rmdir(join(__dirname, 'test'));
})