import { getXFiles } from './utils/getXFiles.mjs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const folder = join(__dirname, '..', 'dist');

try {
    mkdir(folder, { recursive: true });
    mkdir(join(folder, 'bindings'), { recursive: true });
  } catch {}

const rootPackageJson = (await import('../package.json', { assert: { type: 'json' } })).default;
const header = [
    `// Type definitions for bun-utilities ${rootPackageJson.version}`,
    '// Project: https://github.com/xHyroM/bun-utilities',
    '',
    '// This file is bundled so that your TypeScript editor integration loads it faster.',
    '',
    ''
].join('\n');
const filesToCat = await getXFiles('.d.ts');
/*const fileContents = [];

for (let i = 0; i < filesToCat.length; i++) {
  const name = filesToCat[i];
  fileContents.push(
    '// ' +
      name +
      '\n\n' +
      ((await readFile(resolve(__dirname, '..', name), { encoding: 'utf-8' })).toString()) +
      '\n'
  );
}

const text = header + fileContents.join('\n');
await writeFile(join(folder, 'types.d.ts'), text);*/
for (const file of filesToCat) {
  let content = (await readFile(resolve(__dirname, '..', file))).toString();
  if (file.includes('index.d.ts')) content = content.replaceAll('./utils/', './');

  writeFile(join(folder, basename(file)), content);
}

const dotJsFiles = await getXFiles('.js');
const dotMJsFiles = await getXFiles('.mjs');
const jsFiles = [].concat(dotJsFiles, dotMJsFiles);

for (const file of jsFiles) {
  const name = basename(file);
  let text = (await readFile(file)).toString();

  text = text
    .replace("await (await import('../index.mjs')).default()", "await (await import('./index.mjs')).default()")
    .replace("require('../index.js')()", "require('./index.js')()");

  await writeFile(join(folder, name), text);
}

const nodeBindings = await getXFiles('.node');
for (const file of nodeBindings) {
  const name = basename(file);
  
  copyFile(file, join(folder, 'bindings', name));
}

const packageJson = {
  name: rootPackageJson.name,
  version: rootPackageJson.version,
  description: rootPackageJson.description,
  types: './types.d.ts',
  exports: {
    '.': {
      import: './index.mjs',
      require: './index.js'
    },
    './fs': {
      import: './fs.mjs',
      require: './fs.js'
    },
    './os': {
      import: './os.mjs',
      require: './os.js'
    },
    './spawn': {
      import: './spawn.mjs',
      require: './spawn.js'
    },
    './fs.*': {
      import: './fs.*',
      require: './fs.*'
    },
    './os.*': {
      import: './os.*',
      require: './os.*'
    },
    './spawn.*': {
      import: './spawn.*',
      require: './spawn.*'
    },
    './*': {
      import: './*',
      require: './*'
    }
  },
  author: rootPackageJson.author,
  license: rootPackageJson.license,
  repository: rootPackageJson.repository,
  bugs: rootPackageJson.bugs,
  keywords: rootPackageJson.keywords,
}

await copyFile(resolve(__dirname, '..', 'README.md'), join(folder, 'README.md'));
await writeFile(join(folder, 'package.json'), JSON.stringify(packageJson, null, 2));
