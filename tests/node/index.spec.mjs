import test from 'ava'
import { exec } from '../../lib/index.js';

test('exec from native', async(t) => {
  t.is((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, ''), 'test');
})
