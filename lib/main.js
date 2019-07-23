const fs = require('fs');
const getTranslating = require('./parsers');
const checkPath = require('./wrappers/checkPath');
const clearFile = require('./wrappers/clearFile');

// errors
const UnknownParserError = require('./errors/UnknownParserError');
const YandexApiError = require('./errors/YandexApiError');
const VoidStringError = require('./errors/VoidStringError');
const VoidSourceDataError = require('./errors/VoidSourceDataError');
const IncorrectPathError = require('./errors/IncorrectPathError');
const WriteFileError = require('./errors/WriteFileError');
const ClearFileError = require('./errors/ClearFileError');

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

// очистить содержимое файла перед записью результатов
const isClearDstFile = true;

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
// очистить файл перед записью результатов
// *************************
try {
  if (isClearDstFile) {
    clearFile(pathToDstFile);
    console.log(`Файл ${pathToDstFile} очищен!`);
  }
} catch (error) {
  if (error instanceof ClearFileError) {
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
  wordsForParsing.forEach((element, index) => {
    if (element.trim() === '') {
      throw new VoidStringError('Для перевода получена пустая строка!');
    }

    getTranslating(typeTranslating, element)
      .then(response => {
        const promise = new Promise((resolve, reject) => {
          const translate = response.data.text[0];
          fs.appendFile(pathToDstFile, `${element}\t${translate}\n`, err => {
            if (err) {
              reject(
                new WriteFileError(`Не удалось записать данные в файл!`, err)
              );
            } else {
              console.log(`${index}. ${element} ${translate} recorded!`);
            }
            resolve(response);
          });
        });
        return promise;
      })
      .catch(error => {
        console.log(`Ошибка при обработке слова "${element}"`);

        // ошибка при получении ответа от сервера-парсера
        if (error instanceof YandexApiError) {
          console.log(
            `Error! name: '${error.name}', message: '${
              error.message
            }' Cause: '${error.cause.name}', '${error.cause.message}'`
          );

          // ошибка при записи результата
        } else if (error instanceof WriteFileError) {
          console.log(
            `Error! name: '${error.name}', message: '${
              error.message
            }' Cause: '${error.cause.name}', '${error.cause.message}'`
          );
        }

        // остальные непредвиденные ошибки
        else {
          console.log(
            `Unexpected asynchronous error! name: '${error.name}', message: '${
              error.message
            }`
          );
        }
      });
  });
} catch (error) {
  // указан неизвестный тип парсера
  if (error instanceof UnknownParserError) {
    console.log(`Error! stack: '${error.stack}'`);
  }

  // остальные непредвиденные ошибки
  else {
    console.log(`Unexpected error! stack: '${error.stack}'`);
  }
}
