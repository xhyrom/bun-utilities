import { run, bench } from 'mitata';
import { spawn } from '../../lib/index.mjs';

bench('run echo test', async() => await spawn('echo', ['test']));
bench('run node --version', async() => await spawn('node', ['--version']));
bench('run bun --version', async() => await spawn('bun', ['--version']));
bench('run git --version', async() => await spawn('git', ['--version']));

await run();
