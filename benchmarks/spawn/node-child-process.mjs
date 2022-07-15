import { run, bench } from 'mitata';
import util from 'node:util';
import { exec as execCallback } from 'node:child_process';
const execChildProcess = util.promisify(execCallback);

bench('run echo test', async() => await execChildProcess('echo test'));
bench('run node --version', async() => await execChildProcess('node --version'));
bench('run bun --version', async() => await execChildProcess('bun --version'));
bench('run git --version', async() => await execChildProcess('git --version'));

await run();
