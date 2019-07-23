const util = require('util');

function WriteFileError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, WriteFileError);
}

util.inherits(WriteFileError, Error);
WriteFileError.prototype.name = 'WriteFileError';

module.exports = WriteFileError;
