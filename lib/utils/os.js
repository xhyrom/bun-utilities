const bindings = require('../index.js')();

module.exports.homedir = bindings.homedir;
module.exports.cachedir = bindings.cachedir;
module.exports.tempdir = bindings.tempdir;
module.exports.hostname = bindings.hostname;
module.exports.platform = bindings.platform;
module.exports.arch = bindings.arch;
module.exports.release = bindings.release;
module.exports.uptime = bindings.uptime;
module.exports.cpus = bindings.cpus;
module.exports.totalMemory = bindings.totalMemory;
module.exports.usedMemory = bindings.usedMemory;
module.exports.availableMemory = bindings.availableMemory;
module.exports.freeMemory = bindings.freeMemory;
module.exports.totalSwap = bindings.totalSwap;
module.exports.usedSwap = bindings.usedSwap;
