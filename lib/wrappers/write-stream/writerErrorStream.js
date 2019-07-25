const fs = require('fs');
const WriterResultStreamError = require('../../errors/WriterResultStreamError');

const writerStream = pathErrorReportFile => {
  const writerErrorStream = fs.createWriteStream(pathErrorReportFile);

  writerErrorStream.on('error', function(err) {
    throw new WriterResultStreamError(
      'Не удалось записать данные в файл ошибок!',
      err
    );
  });

  return writerErrorStream;
};

module.exports = writerStream;
