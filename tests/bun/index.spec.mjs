import { expect, it } from 'bun:test';
import { exec, spawn } from '../../lib/index.mjs';

it('exec from native', async() => {
  expect((await exec(['echo', 'test'])).output.replace(/\n|\r/g, '')).toBe('test');
})

it('spawn from native', async() => {
  expect((await (await spawn('echo', [ 'test' ])).stdout.replace(/\n|\r/g, ''))).toBe('test');
})