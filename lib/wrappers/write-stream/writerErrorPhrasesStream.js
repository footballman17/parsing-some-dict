const fs = require('fs');

function createStream(pathErrorPhraseReportFile) {
  const writerErrorStream = fs.createWriteStream(pathErrorPhraseReportFile);

  writerErrorStream.on('error', function(err) {
    console.log(
      `Не удалось записать необработанную фразу в файл! Cause: ${err.stack}`
    );
  });

  return writerErrorStream;
}

exports.createStream = createStream;
