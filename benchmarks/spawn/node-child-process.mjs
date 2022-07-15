import { run, bench } from 'mitata';
import util from 'node:util';
import { exec as execCallback } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const execChildProcess = util.promisify(execCallback);

const urlPathName = new URL('.', import.meta.url).pathname;
const __dirname = process.platform === 'win32' ? urlPathName.slice(1) : urlPathName;

bench('run echo test', async() => await execChildProcess('echo test'));
bench('run node --version', async() => await execChildProcess('node --version'));
bench('run bun --version', async() => await execChildProcess('bun --version'));
bench('run git --version', async() => await execChildProcess('git --version'));

const output = await run();
writeFile(join(__dirname, 'outputs', 'node-child-process.json'), JSON.stringify(output));
