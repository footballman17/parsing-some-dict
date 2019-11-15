const fs = require('fs');
const IncorrectPathError = require('../errors/IncorrectPathError');

const checkPath = path => {
  try {
    fs.accessSync(path, fs.constants.F_OK);
  } catch (err) {
    throw new IncorrectPathError('Указан некорректный путь!', err);
  }
};

module.exports = checkPath;
