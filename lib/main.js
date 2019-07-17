const getTranslating = require('./parsers');
const UnknownParserError = require('./errors/UnknownParserError');
const YandexApiError = require('./errors/YandexApiError');

// указать тип перевода:
// 'yandex_simple' - простой первод от Яндекса
// 'yandex_dictionary' - словарный перевод от Яндекса
const typeTranslating = 'yandex_simple';

try {
  getTranslating(typeTranslating).then(
    response => console.log(JSON.stringify(response.data)),
    error => {
      // ошибка при получении ответа от сервера-парсера
      if (error instanceof YandexApiError) {
        console.log(
          `Error! stack: '${error.stack}' Cause: '${error.cause.name}', '${
            error.cause.message
          }'`
        );
      }
    }
  );
} catch (error) {
  // указан неизвестный тип парсера
  if (error instanceof UnknownParserError) {
    console.log(`Error! stack: '${error.stack}'`);
  }
}
