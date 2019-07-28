const fs = require('fs');

function createStream(pathToDstFile) {
  const writerResultStream = fs.createWriteStream(pathToDstFile);

  writerResultStream.on('error', function(err) {
    console.log(
      `Не удалось записать данные в файл результатов! Cause: ${err.stack}`
    );
  });

  return writerResultStream;
}

exports.createStream = createStream;
