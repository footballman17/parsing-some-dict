const fs = require('fs');
const ClearFileError = require('../errors/ClearFileError');

const checkPath = path => {
  try {
    fs.writeFileSync(path, '');
  } catch (err) {
    throw new ClearFileError('Не удалось очистить файл!', err);
  }
};

module.exports = checkPath;
