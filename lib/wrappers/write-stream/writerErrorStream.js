const fs = require('fs');

function createStream(pathErrorReportFile) {
  const writerErrorStream = fs.createWriteStream(pathErrorReportFile);

  writerErrorStream.on('error', function(err) {
    console.log(
      `Не удалось записать данные в файл ошибок! Cause: ${err.stack}`
    );
  });

  return writerErrorStream;
}

exports.createStream = createStream;
