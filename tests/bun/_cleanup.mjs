import { rmdir } from '../../lib/index.mjs';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

rmdir(join(__dirname, 'test'));
rmdir(join(__dirname, 'test-copydir'));
rmdir(join(__dirname, 'test-copyfile'), {
  recursive: true
});
rmdir(join(__dirname, 'test-copyfile-destination'), {
  recursive: true
});