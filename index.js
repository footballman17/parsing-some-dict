const axios = require('axios');

const yandexAPI = {
  urlName: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  key:
    'trnsl.1.1.20180430T235444Z.a3ffa002e8cfdf3b.69ed680dbdc56ff6d91793bea028c576bfa83d3',
};

const word = 'test';

axios
  .get(yandexAPI.urlName, {
    params: {
      key: yandexAPI.key,
      text: word,
      lang: 'en-ru',
    },
  })
  .then(function(response) {
    console.log(response.data.text);
  })
  .catch(function(error) {
    console.log(`Error! code: ${error.name}, message: ${error.message}`);
  })
  .then(function() {
    // always executed
  });
