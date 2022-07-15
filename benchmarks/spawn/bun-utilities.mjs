import { run, bench } from 'mitata';
import { spawn } from '../../lib/index.mjs';
import { join } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

bench('run echo test', async() => await spawn('echo', ['test']));
bench('run node --version', async() => await spawn('node', ['--version']));
bench('run bun --version', async() => await spawn('bun', ['--version']));
bench('run git --version', async() => await spawn('git', ['--version']));

const output = await run();
Bun.write(join(__dirname, 'outputs', 'bun-utilities.json'), JSON.stringify(output));
