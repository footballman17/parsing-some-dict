const util = require('util');

function VoidSourceDataError(message) {
  this.message = message;
  Error.captureStackTrace(this, VoidSourceDataError);
}

util.inherits(VoidSourceDataError, Error);
VoidSourceDataError.prototype.name = 'VoidSourceDataError';

module.exports = VoidSourceDataError;
