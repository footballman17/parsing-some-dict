const fs = require('fs');
const getTranslating = require('./parsers');
const checkPath = require('./wrappers/checkPath');

// errors
const UnknownParserError = require('./errors/UnknownParserError');
const YandexApiError = require('./errors/YandexApiError');
const VoidStringError = require('./errors/VoidStringError');
const VoidSourceDataError = require('./errors/VoidSourceDataError');
const IncorrectPathError = require('./errors/IncorrectPathError');

// *************************
// параметры
// *************************

// путь к файлу со словами для перевода
const pathToSrcFile = './db/src/yandex/src.txt';

// тип перевода
// 'yandex_simple' - простой первод от Яндекса
// 'yandex_dictionary' - словарный перевод от Яндекса
const typeTranslating = 'yandex_simple';

// путь к файлу со словами для перевода
const pathToDstFile = './db/dst/yandex/yandex_simple.txt';
// *************************
// проверка существования путей
// *************************

try {
  checkPath(pathToSrcFile);
  checkPath(pathToDstFile);
} catch (error) {
  if (error instanceof IncorrectPathError) {
    console.log(`Error! stack: '${error.stack}' Cause: '${error.cause}'`);
    // остальные непредвиденные ошибки
  } else {
    console.log(`Unexpected error! stack: '${error.stack}'`);
  }
  process.exit(-1);
}

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
  if (error instanceof IncorrectPathError) {
    console.log(
      `Error! stack: '${error.stack}' Cause: '${error.cause.name}', '${
        error.cause.message
      }'`
    );

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

    getTranslating(typeTranslating, element)
      .then(response => {
        const promise = new Promise((resolve, reject) => {
          fs.access(pathToDstFile, fs.constants.F_OK, err => {
            if (err) {
              reject(new Error(`Указан некорректный путь!`));
            }
            resolve(response);
          });
        });
        return promise;
      })
      .then(response => {
        console.log(JSON.stringify(response.data));
      })

      .catch(error => {
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
      });
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
