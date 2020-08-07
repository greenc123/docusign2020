/* This simple app uses the '/translate' resource to translate text from
one language to another. */

/* This template relies on the request module, a simplified and user friendly
way to make HTTP requests. */
const https = require('https');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config()
const envir = process.env;
var { TRANSLATOR_ENDPOINT, TRANSLATOR_SUBSCRIPTION_KEY } = envir;
/* If you encounter any issues with the base_url or path, make sure that you are
using the latest endpoint: https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate */


async function translateText(text, to) {
    let qs = 'api-version=3.0'
    to.forEach(function(value, index, array) { qs += `&to=${value}` })
    console.log(`/translate?${qs}`)
    let options = {
        method: 'POST',
        hostname: TRANSLATOR_ENDPOINT,
        path: `/translate?${qs}`,
        headers: {
          'Ocp-Apim-Subscription-Key': TRANSLATOR_SUBSCRIPTION_KEY,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
    };
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        // A chunk of data has been received.
        res.on('data', (data) => {
          resolve(data);
        });

      });
      req.write(JSON.stringify([{'Text': text}]));
      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });
};


async function translateTextEndpoint(req, res) {
  console.log(req.body)
  console.log(req.body.text)
  translatePromise = translateText(req.body.text, req.body.to);
  await new Promise((resolve, reject) => {
    translatePromise.then(response => {
      res.send(response);
      resolve();
    });
    translatePromise.catch(err => {
      res.send(err);
      resolve();
    });
  });

}
module.exports = translateTextEndpoint
