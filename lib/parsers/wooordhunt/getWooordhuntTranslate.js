const axios = require('axios');
const WooordhuntApiError = require('../../errors/WooordhuntApiError');

// const featuresMap = {
//     google_ya_translation,
//     is_empty,
//     transcriptions,
//     remarks,
//     rank,
//     first_translation,
//     translations,
//     examples,
//     phrases,
//     root_words,
//     phrase_verbs,
//     word_forms
// };

// const request = [
//   'google_ya_translation',
//   'is_empty',
//   'transcriptions',
//   'remarks',
//   'rank',
//   'first_translation',
//   'translations',
//   'examples',
//   'phrases',
//   'root_words',
//   'phrase_verbs',
//   'word_forms',
// ];

const wooordhuntAPI = {
  urlName: 'http://wooordhunt.ru/word/',
};

const getWooordhunTranslate = async phrase => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(wooordhuntAPI.urlName + phrase, {
        // params: {
        //   key: yandexAPI.key,
        //   text: phrase,
        //   lang: 'en-ru',
        // },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.log(error);
        reject(
          new WooordhuntApiError(
            `Ошибка при получении 'простого' перевода от Wooordhunt!`,
            error
          )
        );
      });
  });
  return promise;
};

module.exports = getWooordhunTranslate;
