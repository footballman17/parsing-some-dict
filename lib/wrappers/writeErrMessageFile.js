const fs = require('fs');

const writeErrMessageFile = (path, data) => {
  fs.appendFile(path, data, err => {
    if (err) throw err;
    console.log('Данные об ошибке записаны в файл!');
  });
};

module.exports = writeErrMessageFile;
