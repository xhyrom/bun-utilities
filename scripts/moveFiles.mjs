import { renameSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'fs';

if (existsSync('./index.js')) unlinkSync('./index.js');
if (!existsSync('./lib/bindings')) mkdirSync("./lib/bindings", { recursive: true });

for (const file of readdirSync('./lib/')) {
    if (file.endsWith('.node')) renameSync(`./lib/${file}`, `./lib/bindings/${file}`)
}