const fs = require('fs');
const getTranslating = require('./parsers');
const UnknownParserError = require('./errors/UnknownParserError');
const YandexApiError = require('./errors/YandexApiError');
const VoidStringError = require('./errors/VoidStringError');
const VoidSourceDataError = require('./errors/VoidSourceDataError');

// *************************
// параметры
// *************************

// путь к файлу со словами для перевода
const pathToSrcFile = './db/src/src.txt';

// тип перевода
// 'yandex_simple' - простой первод от Яндекса
// 'yandex_dictionary' - словарный перевод от Яндекса
const typeTranslating = 'yandex_simple';

// *************************
// чтение файла со словами для перевода
// *************************

let wordsForParsing = '';
try {
  const data = fs.readFileSync(pathToSrcFile, 'utf8', 'r');

  // проверка данных на пустоту
  if (data.trim() === '') {
    throw new VoidSourceDataError(
      'Файл с исходными словами для перевода пуст!'
    );
  }

  wordsForParsing = data.split('\n');
} catch (error) {
  // файл не найден
  if (error.code === 'ENOENT') {
    console.log(`Error! stack: '${error.stack}'`);

    // файл с исходными словами для перевода пуст
  } else if (error instanceof VoidSourceDataError) {
    console.log(`Error! stack: '${error.stack}'`);

    // остальные непредвиденные ошибки
  } else {
    console.log(`Unexpected error! stack: '${error.stack}'`);
  }
  process.exit(-1);
}

// *************************
// парсинг переводов
// *************************

try {
  wordsForParsing.forEach(element => {
    if (element.trim() === '') {
      throw new VoidStringError('Для перевода получена пустая строка!');
    }
    getTranslating(typeTranslating, element).then(
      response => console.log(JSON.stringify(response.data)),
      error => {
        // ошибка при получении ответа от сервера-парсера
        if (error instanceof YandexApiError) {
          console.log(
            `Error! stack: '${error.stack}' Cause: '${error.cause.name}', '${
              error.cause.message
            }'`
          );

          // остальные непредвиденные ошибки
        } else {
          console.log(`Unexpected asynchronous error! stack: '${error.stack}'`);
        }
      }
    );
  });
} catch (error) {
  // указан неизвестный тип парсера
  if (error instanceof UnknownParserError) {
    console.log(`Error! stack: '${error.stack}'`);

    // остальные непредвиденные ошибки
  } else {
    console.log(`Unexpected error! stack: '${error.stack}'`);
  }
}
