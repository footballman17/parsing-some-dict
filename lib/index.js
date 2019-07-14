const getSimpleYandexTranslate = require('./parsers/yandex/getSimpleYandexTranslate');

getSimpleYandexTranslate().then(
  response => console.log(response.data.text),
  error =>
    console.log(
      `Error! code: '${error.name}', message: '${error.message}' Cause: '${
        error.cause.name
      }', '${error.cause.message}'`
    )
);
