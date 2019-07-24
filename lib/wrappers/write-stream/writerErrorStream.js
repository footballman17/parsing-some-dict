const fs = require('fs');

// const writerErrorStream = pathToReportFile =>
//   fs.createWriteStream(pathToReportFile);

const writerErrorStream = fs.createWriteStream('output.txt');

writerErrorStream.on('finish', function() {
  console.log('Запись в отчет ошибок завершена!');
});

writerErrorStream.on('error', function(err) {
  console.log('Ошибка при записи в поток ошибок!');
  console.log(err.stack);
});

module.exports = writerErrorStream;

// exports.writerErrorStream = writerErrorStream;
