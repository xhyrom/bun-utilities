import { run, bench } from 'mitata';
import { copydir, copyfile, rmdir } from '../../lib/index.mjs';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

const copyDirPathEmpty = join(__dirname, 'test-copydir-empty');
await mkdir(copyDirPathEmpty);

const copyDirPathEmptyDestination = join(__dirname, 'test-copydir-empty-destination');

const copyDirPathWithFiles = join(__dirname, 'test-copydir-with-files');
await mkdir(copyDirPathWithFiles);
await Bun.write(join(copyDirPathWithFiles, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

const copyDirPathWithFilesDestination = join(__dirname, 'test-copydir-with-files-destination');

const copyFilePath = join(__dirname, 'test-copyfile', 'test.json');
await mkdir(join(__dirname, 'test-copyfile'));
await Bun.write(copyFilePath, JSON.stringify({ message: "Hello, bun!" }));

const copyFilePathDestination = join(__dirname, 'test-copyfile-destination', 'test.json');
await mkdir(join(__dirname, 'test-copyfile-destination'));

bench('copydir empty', () => copydir(copyDirPathEmpty, copyDirPathEmptyDestination));
bench('copydir files', () => copydir(copyDirPathWithFiles, copyDirPathWithFilesDestination));
bench('rmdir empty', () => rmdir(copyDirPathEmptyDestination));
bench('rmdir files', () => rmdir(copyDirPathWithFilesDestination, { recursive: true }));
bench('copyfile', () => copyfile(copyFilePath, copyFilePathDestination));

const output = await run();
await Bun.write(join(__dirname, 'outputs', 'bun-utilities.json'), JSON.stringify(output));

// Cleanup
await rmdir(copyDirPathEmpty);
await rmdir(copyDirPathWithFiles, { recursive: true });
await rmdir(join(__dirname, 'test-copyfile'), { recursive: true });
await rmdir(join(__dirname, 'test-copyfile-destination'), { recursive: true });
