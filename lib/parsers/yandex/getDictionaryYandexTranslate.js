const axios = require('axios');
const YandexApiError = require('../../errors/YandexApiError');

const yandexAPI = {
  urlName: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
  key:
    'dict.1.1.20180501T235140Z.3d9506ddc6f46895.bf07b106794e07794e6bffbf02a5ab73d6b4b38e',
};

const getDictionaryYandexTranslate = async phrase => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(yandexAPI.urlName, {
        params: {
          key: yandexAPI.key,
          text: phrase,
          lang: 'en-ru',
          flags: 4,
        },
        responseType: 'json',
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(
          new YandexApiError(
            `Ошибка при получении словарного перевода от Яндекса!`,
            error
          )
        );
      });
  });
  return promise;
};

module.exports = getDictionaryYandexTranslate;
