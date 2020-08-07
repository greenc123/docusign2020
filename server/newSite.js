const fetch = require('node-fetch');

require('dotenv').config()
const envir = process.env;
var { DYNAMICS_ENDPOINT, DYNAMICS_BASE_PATH } = envir;

const getAccessToken = require('./getAccessToken');

const newSite = async (req) => {
  const token = await getAccessToken();
  console.log('req', req);
  if (!token) return {}
  try {
    url = `${DYNAMICS_ENDPOINT}/fsc_sites`
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
    console.log('Error in newSite.js', err)
    throw err
  }

}

async function newSiteEndpoint(req, res) {
  res.send(await newSite(req));
}

module.exports = newSiteEndpoint;
