import test from 'ava'
import { exec, spawn } from '../../lib/index.js';

test('exec from native', async(t) => {
  t.is((await exec(['echo', 'test'])).output.replace(/\n|\r/g, ''), 'test');
})

test('spawn from native', async(t) => {
  t.is((await (await spawn('echo', [ 'test' ])).stdout.replace(/\n|\r/g, '')), 'test');
})