const axios = require('axios');
const cheerio = require('cheerio');
const WooordhuntApiError = require('../../errors/WooordhuntApiError');

const Handler = {};

Handler.transcriptions = $ => {
  const transcriptionsArr = [];

  const american = $('#us_tr_sound > span.transcription')
    .text()
    .trim()
    .slice(1, -1);
  const british = $('#uk_tr_sound > span.transcription')
    .text()
    .trim()
    .slice(1, -1);

  if (!(american === '' && british === '')) {
    transcriptionsArr.push({
      american,
      british,
    });
  }
  return transcriptionsArr;
};

Handler.googleYaTranslation = $ =>
  $('#wd_content > div.light_tr')
    .text()
    .trim()
    .slice(2);

Handler.rank = $ =>
  $('#rank_box')
    .text()
    .trim();

const featuresMap = [
  'googleYaTranslation',
  // is_empty,
  'transcriptions',
  // remarks,
  'rank',
  // first_translation,
  // translations,
  // examples,
  // phrases,
  // root_words,
  // phrase_verbs,
  // word_forms,
];

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
      .then(response => response.data)
      .then(html => {
        const $ = cheerio.load(html);

        const result = {};
        featuresMap.forEach(function(feature, i, arr) {
          const dumpStringResult = Handler[feature]($);

          if (dumpStringResult !== '') {
            result[feature] = dumpStringResult;
          }
        });
        resolve(JSON.stringify(result));
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
