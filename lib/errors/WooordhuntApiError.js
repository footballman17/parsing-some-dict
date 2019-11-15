const util = require('util');

function WooordhuntApiError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, WooordhuntApiError);
}

util.inherits(WooordhuntApiError, Error);
WooordhuntApiError.prototype.name = 'WooordhuntApiError';

module.exports = WooordhuntApiError;
