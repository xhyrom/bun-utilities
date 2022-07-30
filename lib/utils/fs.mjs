const bindings = await (await import('../index.mjs')).default();

export const rmdir = bindings.rmdir;
export const copyfile = bindings.copyfile;
export const copydir = bindings.copydir;
