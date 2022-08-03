const bindings = await (await import('../index.mjs')).default();

export const homedir = bindings.homedir;
export const cachedir = bindings.cachedir;
export const tempdir = bindings.tempdir;
export const hostname = bindings.hostname;
export const platform = bindings.platform;
export const arch = bindings.arch;
export const release = bindings.release;
export const uptime = bindings.uptime;
export const cpus = bindings.cpus;
export const totalMemory = bindings.totalMemory;
export const freeMemory = bindings.freeMemory;
export const totalSwap = bindings.totalSwap;
export const freeSwap = bindings.freeSwap;
export const networkInterfaces = bindings.networkInterfaces;
