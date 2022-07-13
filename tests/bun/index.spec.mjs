import { expect, it } from 'bun:test';
import { exec, spawn } from '../../lib/index.mjs';

it('exec from native', async() => {
  expect((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, '')).toBe('test');
})
