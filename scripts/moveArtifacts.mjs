import { renameSync, readdirSync, existsSync } from 'fs';

if (!existsSync('./lib/bindings')) mkdirSync("./lib/bindings", { recursive: true });

for (const folder of readdirSync('./artifacts')) {
    for (const file of readdirSync(`./artifacts/${folder}`)) {
        renameSync(`./artifacts/${folder}/${file}`, `./lib/bindings/${file}`);
    }
}
