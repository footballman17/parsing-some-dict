const util = require('util');

function UnknownParserError(message) {
  this.message = message;
  Error.captureStackTrace(this, UnknownParserError);
}

util.inherits(UnknownParserError, Error);
UnknownParserError.prototype.name = 'UnknownParserError';

module.exports = UnknownParserError;
