const util = require('util');

function WriterErrorPhrasesStreamError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, WriterErrorPhrasesStreamError);
}

util.inherits(WriterErrorPhrasesStreamError, Error);
WriterErrorPhrasesStreamError.prototype.name = 'WriterErrorPhrasesStreamError';

module.exports = WriterErrorPhrasesStreamError;
