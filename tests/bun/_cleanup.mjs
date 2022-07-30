import { join } from 'path';
import { rmdir } from '../../lib/utils/fs.mjs';

const __dirname = new URL('.', import.meta.url).pathname;

rmdir(join(__dirname, 'test'));
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