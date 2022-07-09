import { readdirSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';

if (!existsSync('./lib/bindings')) mkdirSync('./lib/bindings');

for(const dir of readdirSync('./npm')) {
    for (const file of readdirSync(`./npm/${dir}`)) {
        if (!file.endsWith('.node')) continue;

        writeFileSync(`./lib/bindings/${file}`, readFileSync(`./npm/${dir}/${file}`))
    }
}

"".endsWith('.node')