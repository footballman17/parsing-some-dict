const fs = require('fs');
const WriterResultStreamError = require('../../errors/WriterResultStreamError');

function createStream(pathToDstFile) {
  const writerResultStream = fs.createWriteStream(pathToDstFile);

  writerResultStream.on('error', function(err) {
    throw new WriterResultStreamError(
      'Не удалось записать данные в файл результатов!',
      err
    );
  });

  return writerResultStream;
}

exports.createStream = createStream;
