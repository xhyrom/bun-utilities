import { run, bench, group } from 'mitata';
import { copydir, copyfile, rmdir } from '../../lib/utils/fs.mjs';
import { copyFile, mkdir } from 'fs/promises';
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

const copyFilePathDestinationPaths = [];
const createNewCopyFilePathDestination = async(array) => {
    const path = join(__dirname, 'test-copyfile-destination' + Math.random().toString().slice(-8));
    array.push(path);
    await mkdir(path);
    return join(path, 'test.json');
}
for (let i = 0; i < 6307; i++) createNewCopyFilePathDestination(copyFilePathDestinationPaths);

bench('copydir empty', () => copydir(copyDirPathEmpty, copyDirPathEmptyDestination));
bench('copydir files', () => copydir(copyDirPathWithFiles, copyDirPathWithFilesDestination));
bench('rmdir empty', () => rmdir(copyDirPathEmptyDestination));
bench('rmdir files', () => rmdir(copyDirPathWithFilesDestination, { recursive: true }));

let i = 0;
let i2 = 0;
group('copyfile', () => {
    bench('bun-utilities implementation', () => {
        copyfile(copyFilePath, join(copyFilePathDestinationPaths[i2], 'test.json'), {
            recursive: true
        });
        i2++;
    });

    bench('bun implementation', () => {
        copyFile(copyFilePath, join(copyFilePathDestinationPaths[i], 'test.json'));
        i++;
    });
});

// For summary between bun-utilities and nodejs
bench('copyfile', () => copyfile(copyFilePath, copyFilePathDestination));

const output = await run();
await Bun.write(join(__dirname, 'outputs', 'bun-utilities.json'), JSON.stringify(output));

// Cleanup
await rmdir(copyDirPathEmpty);
await rmdir(copyDirPathWithFiles, { recursive: true });
await rmdir(join(__dirname, 'test-copyfile'), { recursive: true });
await rmdir(join(__dirname, 'test-copyfile-destination'), { recursive: true });

for (const path of copyFilePathDestinationPaths) {
    await rmdir(path, { recursive: true });
}
