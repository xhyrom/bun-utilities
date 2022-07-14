import { expect, it } from 'bun:test';
import { exec, rmdir, copydir } from '../../lib/index.mjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

it('exec', async() => {
  expect((await exec(['echo', 'test'])).stdout.replace(/\n|\r/g, '')).toBe('test');
})

it('rmdir', () => {
  it('without recursive', () => {
    const path = join(__dirname, 'test');
    if (!existsSync(path)) mkdirSync(path);
    if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
    writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));
  
    const output = rmdir(join(__dirname, 'test'));
    expect(output).toBe('directory not empty');
  });

  it('with recursive', () => {
    const path = join(__dirname, 'test');
    if (!existsSync(path)) mkdirSync(path);
    if (!existsSync(join(path, 'test'))) mkdirSync(join(path, 'test'));
    writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));
  
    const output = rmdir(join(__dirname, 'test'), {
      recursive: true
    });
  
    expect(output).toBe('ok');
  });
})

it('copydir', () => {
  it('without recursive', async() => {
    const path = join(__dirname, 'test-copydir');
    const pathDestination = join(__dirname, 'test-copydir-destination');
    if (!existsSync(path)) mkdirSync(path);
    writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));
  
    if (!existsSync(pathDestination)) mkdirSync(pathDestination);
    writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: "Hello, bun! without recursive" }));

    copydir(path, pathDestination);

    const file = atob(await (await Bun.file(join(pathDestination, 'test.json')).text()));
    expect(file).toBe(atob(JSON.stringify({ message: "Hello, bun! without recursive" })));
  });

  it('with recursive', async() => {
    const path = join(__dirname, 'test-copydir');
    const pathDestination = join(__dirname, 'test-copydir-destination');
    if (!existsSync(path)) mkdirSync(path);
    writeFileSync(join(path, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));
  
    if (!existsSync(pathDestination)) mkdirSync(pathDestination);
    writeFileSync(join(pathDestination, 'test.json'), JSON.stringify({ message: "Hello, bun! without recursive" }));

    copydir(path, pathDestination, {
      recursive: true
    });

    const file = atob(await (await Bun.file(join(pathDestination, 'test.json')).text()));
    expect(file).toBe(atob(JSON.stringify({ message: "Hello, bun!" })));
  });
})

rmdir(join(__dirname, 'test'));
rmdir(join(__dirname, 'test-copydir'));
rmdir(join(__dirname, 'test-copydir-destination'));
