import { readdir } from 'node:fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const getXFiles = async(suffix, folder = join(__dirname, '..', '..', 'lib')) => {
    const allXFiles = [];

    const getFiles = async(fldr) => {
        for await(const file of await readdir(fldr, { withFileTypes: true })) {
            if (file.isDirectory()) await getFiles(join(fldr, file.name));
            else if (file.name.endsWith(suffix)) allXFiles.push(join(fldr, file.name));
        }
    }

    await getFiles(folder)

    return allXFiles;
} 