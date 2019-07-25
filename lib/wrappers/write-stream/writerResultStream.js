const fs = require('fs');
const WriterResultStreamError = require('../../errors/WriterResultStreamError');

const writerStream = pathToDstFile => {
  const writerResultStream = fs.createWriteStream(pathToDstFile);

  writerResultStream.on('error', function(err) {
    throw new WriterResultStreamError(
      'Не удалось записать данные в файл результатов!',
      err
    );
  });

  return writerResultStream;
};

module.exports = writerStream;
