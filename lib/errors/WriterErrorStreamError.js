const util = require('util');

function WriterErrorStreamError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, WriterErrorStreamError);
}

util.inherits(WriterErrorStreamError, Error);
WriterErrorStreamError.prototype.name = 'WriterErrorStreamError';

module.exports = WriterErrorStreamError;
