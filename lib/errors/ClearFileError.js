const util = require('util');

function ClearFileError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, ClearFileError);
}

util.inherits(ClearFileError, Error);
ClearFileError.prototype.name = 'ClearFileError';

module.exports = ClearFileError;
