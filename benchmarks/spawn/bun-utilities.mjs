import { run, bench } from 'mitata';
import { spawn } from '../../lib/utils/spawn.mjs';
import { join } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

bench('run echo test', () => spawn('echo', ['test']));
bench('run node --version', () => spawn('node', ['--version']));
bench('run bun --version', () => spawn('bun', ['--version']));
bench('run git --version', () => spawn('git', ['--version']));

const output = await run();
await Bun.write(join(__dirname, 'outputs', 'bun-utilities.json'), JSON.stringify(output));
