import { run, bench } from 'mitata';
import { mkdir, writeFile, rm, access, readFile, stat, readdir, rmdir } from 'fs/promises';
import { join } from 'path';

const urlPathName = new URL('.', import.meta.url).pathname;
const __dirname = process.platform === 'win32' ? urlPathName.slice(1) : urlPathName;

const copyDirPathEmpty = join(__dirname, 'test-copydir-empty');
await mkdir(copyDirPathEmpty);

const copyDirPathEmptyDestination = join(__dirname, 'test-copydir-empty-destination');

const copyDirPathWithFiles = join(__dirname, 'test-copydir-with-files');
await mkdir(copyDirPathWithFiles);
await writeFile(join(copyDirPathWithFiles, 'test.json'), JSON.stringify({ message: "Hello, bun!" }));

const copyDirPathWithFilesDestination = join(__dirname, 'test-copydir-with-files-destination');

const existsFileOrFolder = async(src) => {
    try {
        await access(src);
        return true;
    } catch(e) {
        return false;
    }
} 

const copyDirectory = async(src, dest) => {
    const exists = await existsFileOrFolder(src);
    const existsDestination = await existsFileOrFolder(dest);
    if (!exists) return;

    if ((await stat(src)).isDirectory()) {
      if (!existsDestination) await mkdir(dest);

      for (const dir of (await readdir(src))) copyDirectory(join(src, dir), join(dest, dir));
    } else await writeFile(dest, await readFile(src, { encoding: 'utf-8', flag: 'r' }).toString());
};

bench('copydir empty', async() => await copyDirectory(copyDirPathEmpty, copyDirPathEmptyDestination));
bench('copydir files', async() => await copyDirectory(copyDirPathWithFiles, copyDirPathWithFilesDestination));
bench('rmdir empty', async() => await rm(copyDirPathEmptyDestination, { recursive: true, force: true }));
bench('rmdir files', async() => await rm(copyDirPathWithFilesDestination, { recursive: true, force: true }));

const output = await run();
writeFile(join(__dirname, 'outputs', 'node-fs.json'), JSON.stringify(output));

// Cleanup
await rmdir(copyDirPathEmpty, { recrusive: true });
await rmdir(copyDirPathWithFiles, { recursive: true });
