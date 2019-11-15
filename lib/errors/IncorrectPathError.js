const util = require('util');

function IncorrectPathError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, IncorrectPathError);
}

util.inherits(IncorrectPathError, Error);
IncorrectPathError.prototype.name = 'IncorrectPathError';

module.exports = IncorrectPathError;
