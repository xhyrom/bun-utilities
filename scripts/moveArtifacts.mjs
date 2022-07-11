import { renameSync, readdirSync } from 'fs';

for (const folder of readdirSync('./artifacts')) {
    for (const file of readdirSync(`./artifacts/${folder}`)) {
        renameSync(`./artifacts/${folder}/${file}`, `./lib/bindings/${file}`);
    }
}