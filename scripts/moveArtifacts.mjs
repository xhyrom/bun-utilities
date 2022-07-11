import { renameSync, readdirSync } from 'fs';

for (const file of readdirSync('./artifacts')) {
    renameSync(`./artifacts/${file}`, `./lib/bindings/${file}`);
}