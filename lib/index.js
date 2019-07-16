// const getSimpleYandexTranslate = require('./parsers/yandex/getSimpleYandexTranslate');
// const getDictionaryYandexTranslate = require('./parsers/yandex/getDictionaryYandexTranslate');

const getTranslating = require('./parsers');

// указать тип перевода:
// 'yandex_simple' - простой первод от Яндекса
// 'yandex_dictionary' - словарный перевод от Яндекса
const typeTranslating = 'yandex_dictionary';

const parsingMethod = getTranslating(typeTranslating);

parsingMethod.then(
  response => console.log(JSON.stringify(response.data)),
  error =>
    console.log(
      `Error! code: '${error.name}', message: '${error.message}' Cause: '${
        error.cause.name
      }', '${error.cause.message}'`
    )
);
