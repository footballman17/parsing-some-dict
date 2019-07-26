const util = require('util');

function VoidStringError(message) {
  this.message = message;
  Error.captureStackTrace(this, VoidStringError);
}

util.inherits(VoidStringError, Error);
VoidStringError.prototype.name = 'VoidStringError';

module.exports = VoidStringError;
