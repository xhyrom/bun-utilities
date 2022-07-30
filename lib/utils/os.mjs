const bindings = await (await import('../index.mjs')).default();

/**
 * @type {import('../index').homedir}
 */
export const homedir = bindings.homedir;
/**
  * @type {import('../index').cachedir}
  */
export const cachedir = bindings.cachedir;
/**
  * @type {import('../index').tempdir}
  */
export const tempdir = bindings.tempdir;
/**
  * @type {import('../index').hostname}
  */
export const hostname = bindings.hostname;
/**
  * @type {import('../index').platform}
  */
export const platform = bindings.platform;
/**
  * @type {import('../index').arch}
  */
export const arch = bindings.arch;
/**
  * @type {import('../index').release}
  */
export const release = bindings.release;
/**
  * @type {import('../index').uptime}
  */
export const uptime = bindings.uptime;
/**
  * @type {import('../index').cpus}
  */
export const cpus = bindings.cpus;
/**
  * @type {import('../index').totalMemory}
  */
export const totalMemory = bindings.totalMemory;
/**
  * @type {import('../index').usedMemory}
  */
export const usedMemory = bindings.usedMemory;
/**
  * @type {import('../index').availableMemory}
  */
export const availableMemory = bindings.availableMemory;
/**
  * @type {import('../index').freeMemory}
  */
export const freeMemory = bindings.freeMemory;
/**
  * @type {import('../index').totalSwap}
  */
export const totalSwap = bindings.totalSwap;
/**
  * @type {import('../index').usedSwap}
  */
export const usedSwap = bindings.usedSwap;
