const fs = require('fs');
const getTranslating = require('./parsers');
const checkPath = require('./wrappers/checkPath');
const clearFile = require('./wrappers/clearFile');
const getCurrentDate = require('./wrappers/getCurrentDate');

// errors
const UnknownParserError = require('./errors/UnknownParserError');
const YandexApiError = require('./errors/YandexApiError');
const VoidStringError = require('./errors/VoidStringError');
const VoidSourceDataError = require('./errors/VoidSourceDataError');
const IncorrectPathError = require('./errors/IncorrectPathError');
const ClearFileError = require('./errors/ClearFileError');
const WooordhuntApiError = require('./errors/WooordhuntApiError');

// *************************
// параметры
// *************************

// тип перевода
// 'yandex_simple' - простой первод от Яндекса
// 'yandex_dictionary' - словарный перевод от Яндекса
// 'wooordhunt' - перевод от wooordhunt
const typeTranslating = 'wooordhunt';

// путь к файлу со словами для перевода
const pathToSrcFile = `./db/src/${typeTranslating.split('_')[0]}/src.txt`;

// путь к каталогу с результатами
const pathToDstFileFolder = `./db/dst/${typeTranslating.split('_')[0]}/`;

// путь к каталогу с отчетами
const pathToReportFolder = `./db/reports/errors/${
  typeTranslating.split('_')[0]
}/`;

// очистить содержимое файла перед записью результатов
const isClearDstFile = false;

// путь к файлу со словами для перевода
const pathToDstFile = `${pathToDstFileFolder}result_${typeTranslating}_${getCurrentDate()}.txt`;

// путь к файлу с отчетами об ошибках
const pathErrorReportFile = `${pathToReportFolder +
  typeTranslating}_${getCurrentDate()}.txt`;

const pathErrorPhraseReportFile = `${pathToReportFolder}phrases_${typeTranslating}_${getCurrentDate()}.txt`;

// *************************
// проверка существования путей
// *************************
try {
  checkPath(pathToSrcFile);
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
const writerResultStreamObj = require('./wrappers/write-stream/writerResultStream');
const writerErrorStreamObj = require('./wrappers/write-stream/writerErrorStream');
const writerErrorPhrasesStreamObj = require('./wrappers/write-stream/writerErrorPhrasesStream');

let createErrStreamFlag = true;
let createResultStreamFlag = true;
let writerErrorStream = null;
let writerResultStream = null;
let writerErrorPhrasesStream = null;

// *************************
// парсинг переводов
// *************************
const parsing = async () => {
  // создание потоков для записи результатов
  let index = 1;
  let errorIndex = 0;
  for (const element of wordsForParsing) {
    try {
      if (element.trim() === '') {
        throw new VoidStringError('Для перевода получена пустая строка!');
      }

      // парсинг
      const translate = await getTranslating(typeTranslating, element);

      // console.log(response);
      // process.exit(1);

      // если получен хотя бы один перевод от сервера,
      // то создаем поток для записи результатов
      if (createResultStreamFlag) {
        writerResultStream = writerResultStreamObj.createStream(pathToDstFile);
        createResultStreamFlag = false;
      }

      // запись результатов в файл
      writerResultStream.write(`${element}\t${translate}\n`, 'utf8');

      // вывод сообщения о готовности в консоль
      console.log(`${index}. ${element} - ready!`);
    } catch (error) {
      errorIndex += 1;

      // если появилась хотя бы одна ошибка,
      // то создаем поток для записи ошибок
      if (createErrStreamFlag) {
        writerErrorStream = writerErrorStreamObj.createStream(
          pathErrorReportFile
        );

        writerErrorPhrasesStream = writerErrorPhrasesStreamObj.createStream(
          pathErrorPhraseReportFile
        );
        createErrStreamFlag = false;
      }
      const errMessage = `${index}. Ошибка при обработке слова "${element}". `;
      let detailErrMessage = '';

      // неизвестный тип парсера
      if (error instanceof UnknownParserError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }`;
      }

      // ошибка при получении ответа от сервера Яндекса
      else if (error instanceof YandexApiError) {
        detailErrMessage = `Error! name: '${error.name}', message: '${
          error.message
        }' Cause: '${error.cause.name}', '${error.cause.message}'`;
      }

      // ошибка при получении ответа от сервера Wooordhunt
      else if (error instanceof WooordhuntApiError) {
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

      // остальные непредвиденные ошибки
      else {
        detailErrMessage = `Unexpected error! name: '${
          error.name
        }', message: '${error.message}`;
      }
      const fullErrMessage = errMessage + detailErrMessage;

      // запись сообщения об ошибке в файл
      writerErrorStream.write(`${fullErrMessage}\n`, 'utf8');

      // запись необработанной фразы в файл
      writerErrorPhrasesStream.write(`${element}\n`, 'utf8');

      // вывод ошибки в консоль
      console.log(fullErrMessage);
    }
    index += 1;
  }
  console.log(
    `Обработано слов - ${index - 1}, количество ошибок - ${errorIndex}`
  );
};

(async () => {
  console.log('Скрипт начал работу');
  await parsing().then(() => {
    if (!createResultStreamFlag) writerResultStream.end();
    if (!createErrStreamFlag) writerErrorStream.end();
  });
  console.log('Скрипт завершил работу');
})();
