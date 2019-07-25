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
const ClearFileError = require('./errors/ClearFileError');
const WriterResultStreamError = require('./errors/WriterResultStreamError');

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

// путь к каталогу с отчетами
const pathToReportFolder = './db/reports/';

// очистить содержимое файла перед записью результатов
const isClearDstFile = true;

const pathToReportFile = `${pathToReportFolder + new Date()}.txt`;

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
// создание потоков для записи результатов
// *************************
const writerResultStream = require('./wrappers/write-stream/writerResultStream')(
  pathToDstFile
);
const writerErrorStream = require('./wrappers/write-stream/writerErrorStream')();

// *************************
// парсинг переводов
// *************************
const parsing = async () => {
  // создание потоков для записи результатов
  let index = 1;
  for (const element of wordsForParsing) {
    try {
      if (element.trim() === '') {
        throw new VoidStringError('Для перевода получена пустая строка!');
      }

      const response = await getTranslating(typeTranslating, element);
      const translate = await response.data.text[0];

      writerResultStream.write(`${element}\t${translate}\n`, 'utf8');

      console.log(`${index}. ${element} - ready!`);
    } catch (error) {
      const errMessage = `${index}. Ошибка при обработке слова "${element}". `;
      let detailErrMessage = '';

      // неизвестный тип парсера
      if (error instanceof UnknownParserError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }`;
      }

      // ошибка при получении ответа от сервера-парсера
      else if (error instanceof YandexApiError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }' Cause: '${error.cause.name}', '${error.cause.message}'`;
      }

      // для перевода получена пустая строка
      else if (error instanceof VoidStringError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }`;
      }

      // ошибка при записи результатов
      else if (error instanceof WriterResultStreamError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }' Cause: '${error.cause.name}', '${error.cause.message}'`;
      }

      // остальные непредвиденные ошибки
      else {
        detailErrMessage = `Unexpected asynchronous error! name: '${
          error.name
        }', message: '${error.message}`;

        console.log(errMessage + detailErrMessage);
      }
      const fullErrMessage = errMessage + detailErrMessage;
      console.log(fullErrMessage);
    }
    index += 1;
  }
};

(async () => {
  console.log('Скрипт начал работу');
  await parsing().then(() => {
    writerResultStream.end();

    console.log('Скрипт завершил работу');
  });
})();
