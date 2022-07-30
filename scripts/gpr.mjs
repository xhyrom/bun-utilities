import { writeFileSync } from 'fs';

import pkg from '../dist/package.json' assert {type: 'json'};

pkg.name = `@xhyrom/${pkg.name}`;
writeFileSync('./dist/package.json', JSON.stringify(pkg));