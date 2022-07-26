import { rmdir } from '../../lib/index.js';
import { join } from 'path';

const urlPathName = new URL('.', import.meta.url).pathname;
const __dirname = process.platform === 'win32' ? urlPathName.slice(1) : urlPathName;

rmdir(join(__dirname, 'test'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copydir'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copydir-destination'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copyfile'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copyfile-destination'), {
    recursive: true
});