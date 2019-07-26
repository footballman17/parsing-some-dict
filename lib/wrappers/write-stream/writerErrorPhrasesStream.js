const fs = require('fs');
const WriterErrorPhrasesStreamError = require('../../errors/WriterErrorPhrasesStreamError');

function createStream(pathErrorPhraseReportFile) {
  const writerErrorStream = fs.createWriteStream(pathErrorPhraseReportFile);

  writerErrorStream.on('error', function(err) {
    throw new WriterErrorPhrasesStreamError(
      'Не удалось записать необработанную фразу в файл!',
      err
    );
  });

  return writerErrorStream;
}

exports.createStream = createStream;
