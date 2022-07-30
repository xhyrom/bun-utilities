const bindings = await (await import('../index.mjs')).default();

/**
 * @type {import('../index').exec}
 */
export const exec = bindings.exec;
/**
  * @type {import('../index').spawn}
  */
export const spawn = bindings.spawn;
/**
  * @type {import('../index').execAndDontWait}
  */
export const execAndDontWait = bindings.execAndDontWait;
/**
  * @type {import('../index').spawnAndDontWait}
  */
export const spawnAndDontWait = bindings.spawnAndDontWait;
