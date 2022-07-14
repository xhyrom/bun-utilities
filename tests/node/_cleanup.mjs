import { rmdir } from '../../lib/index.js';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

rmdir(join(__dirname, 'test'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copydir'), {
    recursive: true
});
rmdir(join(__dirname, 'test-copydir-destination'), {
    recursive: true
});