const bindings = require('../index.js')();

module.exports.exec = bindings.exec;
module.exports.spawn = bindings.spawn;
module.exports.execAndDontWait = bindings.execAndDontWait;
module.exports.spawnAndDontWait = bindings.spawnAndDontWait;
