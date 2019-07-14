const axios = require('axios');
const util = require('util');

const yandexAPI = {
  urlName: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  key:
    'trnsl.1.1.20180430T235444Z.a3ffa002e8cfdf3b.69ed680dbdc56ff6d91793bea028c576bfa83d3',
};

function YandexApiError(message, errObjCause) {
  this.message = message;
  this.cause = errObjCause;
  Error.captureStackTrace(this, YandexApiError);
}

util.inherits(YandexApiError, Error);
YandexApiError.prototype.name = 'YandexApiError';

const word = 'test';

const httpGet = () => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(yandexAPI.urlName, {
        params: {
          key: yandexAPI.key,
          text: word,
          lang: 'en-ru',
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(
          new YandexApiError('Ошибка при получении перевода от Яндекса!', error)
        );
      });
  });
  return promise;
};

httpGet().then(
  response => console.log(response.data.text),
  error =>
    console.log(
      `Error! code: '${error.name}', message: '${error.message}' Cause: '${
        error.cause.name
      }', '${error.cause.message}'`
    )
);
