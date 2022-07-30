const bindings = await (await import('../index.mjs')).default();

/**
 * @type {import('../index').rmdir}
 */
export const rmdir = bindings.rmdir;
/**
  * @type {import('../index').copyfile}
  */
export const copyfile = bindings.copyfile;
/**
  * @type {import('../index').copydir}
  */
export const copydir = bindings.copydir;
