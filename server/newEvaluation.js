const fetch = require('node-fetch');

require('dotenv').config()
const envir = process.env;
var { DYNAMICS_ENDPOINT, DYNAMICS_BASE_PATH } = envir;

const getAccessToken = require('./getAccessToken');

const newEvaluation = async (req) => {
  const token = await getAccessToken();
  console.log('req', req);
  if (!token) return {}
  try {
    url = `${DYNAMICS_ENDPOINT}/fsc_evaluations`
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(req.body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('Error in newEvaluation.js', err)
    throw err
  }

}

async function newEvaluationEndpoint(req, res) {
  res.send(await newEvaluation(req));
}

module.exports = newEvaluationEndpoint;
