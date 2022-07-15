import { summary } from 'mitata/reporter/table.mjs';
import { join } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

const outputBunUtilities = JSON.parse(await (await Bun.file(join(__dirname, 'outputs', 'bun-utilities.json'))).text()).benchmarks.map(b => {
    return { ...b, name: `[bun-utilities] ${b.name}`, id: b.name };
});
const outputNodeChildProcess = JSON.parse(await (await Bun.file(join(__dirname, 'outputs', 'node-child-process.json'))).text()).benchmarks.map(b => {
    return { ...b, name: `[node-child-process] ${b.name}`, id: b.name };
});

const benchmarks = [].concat(outputBunUtilities, outputNodeChildProcess);
const summaries = [
    'run echo test',
    'run bun --version',
    'run git --version',
    'run node --version'
];

for (const summaryName of summaries) {
    const filtered = benchmarks.filter(b => b.id === summaryName);
    console.log(summary(filtered));
}
