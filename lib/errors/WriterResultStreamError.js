const util = require('util');

function WriterResultStreamError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, WriterResultStreamError);
}

util.inherits(WriterResultStreamError, Error);
WriterResultStreamError.prototype.name = 'WriterResultStreamError';

module.exports = WriterResultStreamError;
