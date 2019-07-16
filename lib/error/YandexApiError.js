const util = require('util');

function YandexApiError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, YandexApiError);
}

util.inherits(YandexApiError, Error);
YandexApiError.prototype.name = 'YandexApiError';

module.exports = YandexApiError;
