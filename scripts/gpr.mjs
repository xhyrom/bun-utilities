import { writeFileSync } from 'fs';

import pkg from '../package.json' assert {type: 'json'};

pkg.name = `@xhyrom/${pkg.name}`;
writeFileSync('./package.json', JSON.stringify(pkg));