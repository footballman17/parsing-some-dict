const fs = require('fs');
const WriterErrorStreamError = require('../../errors/WriterErrorStreamError');

function createStream(pathErrorReportFile) {
  const writerErrorStream = fs.createWriteStream(pathErrorReportFile);

  writerErrorStream.on('error', function(err) {
    throw new WriterErrorStreamError(
      'Не удалось записать данные в файл ошибок!',
      err
    );
  });

  return writerErrorStream;
}

exports.createStream = createStream;
