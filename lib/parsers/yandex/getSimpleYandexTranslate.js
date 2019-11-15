const axios = require('axios');
const YandexApiError = require('../../errors/YandexApiError');

const yandexAPI = {
  urlName: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  key:
    'trnsl.1.1.20180430T235444Z.a3ffa002e8cfdf3b.69ed680dbdc56ff6d91793bea028c576bfa83d36',
};

const getSimpleYandexTranslate = async phrase => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(yandexAPI.urlName, {
        params: {
          key: yandexAPI.key,
          text: phrase,
          lang: 'en-ru',
          // lang: 'ru-de',
        },
      })
      .then(response => {
        resolve(response.data.text[0]);
      })
      .catch(error => {
        // console.log(error);
        reject(
          new YandexApiError(
            `Ошибка при получении 'простого' перевода от Яндекса!`,
            error
          )
        );
      });
  });
  return promise;
};

module.exports = getSimpleYandexTranslate;
