import { run, bench } from 'mitata';
import { copydir, rmdir } from '../../lib/index.mjs';
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

bench('copydir empty', async() => await copydir(copyDirPathEmpty, copyDirPathEmptyDestination));
bench('copydir files', async() => await copydir(copyDirPathWithFiles, copyDirPathWithFilesDestination));
bench('rmdir empty', async() => await rmdir(copyDirPathEmptyDestination));
bench('rmdir with files', async() => await rmdir(copyDirPathWithFilesDestination, { recursive: true }));

await run();

// Cleanup
await rmdir(copyDirPathEmpty);
await rmdir(copyDirPathWithFiles, { recursive: true });
