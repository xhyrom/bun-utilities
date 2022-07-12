import { expect, it } from 'bun:test';

import { exec } from '../../lib/index.mjs';

it('exec from native', async(t) => {
  expect((await exec(['echo', 'test'])).output.replace(/\n|\r/g, '')).toBe('test');
})