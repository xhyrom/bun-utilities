const bindings = await (await import('../index.mjs')).default();

export const exec = bindings.exec;
export const spawn = bindings.spawn;
export const execAndDontWait = bindings.execAndDontWait;
export const spawnAndDontWait = bindings.spawnAndDontWait;
