const UnknownParameterError = require('../errors/UnknownParserError');
const getSimpleYandexTranslate = require('./yandex/getSimpleYandexTranslate');
const getDictionaryYandexTranslate = require('./yandex/getDictionaryYandexTranslate');

const getTranslating = (typeTranslating, phrase) => {
  switch (typeTranslating) {
    case 'yandex_simple':
      return getSimpleYandexTranslate(phrase);

    case 'yandex_dictionary':
      return getDictionaryYandexTranslate(phrase);

    default:
      throw new UnknownParameterError('Указан неизвестный тип парсера!');
  }
};

module.exports = getTranslating;
