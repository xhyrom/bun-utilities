const bindings = require('../index.js')();

module.exports.rmdir = bindings.rmdir;
module.exports.copyfile = bindings.copyfile;
module.exports.copydir = bindings.copydir;
