import { renameSync, existsSync, readdirSync, unlinkSync } from 'fs';

if (existsSync('./index.js')) unlinkSync('./index.js');

for (const file of readdirSync('./lib/')) {
    if (file.endsWith('.node')) renameSync(`./lib/${file}`, `./lib/bindings/${file}`)
}