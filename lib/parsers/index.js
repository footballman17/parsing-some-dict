const getSimpleYandexTranslate = require('./yandex/getSimpleYandexTranslate');
const getDictionaryYandexTranslate = require('./yandex/getDictionaryYandexTranslate');

const getTranslating = typeTranslating => {
  switch (typeTranslating) {
    case 'yandex_simple':
      return getSimpleYandexTranslate();

    case 'yandex_dictionary':
      return getDictionaryYandexTranslate();

    default:
    // throw new UnknownParameterError();
  }
};

module.exports = getTranslating;
