const fetch = require('node-fetch');

require('dotenv').config()
const envir = process.env;
var { DYNAMICS_ENDPOINT, DYNAMICS_BASE_PATH } = envir;

const getAccessToken = require('./getAccessToken');

const getCertificateAttachment = async () => {
  const token = await getAccessToken();
  console.log('token', token);
  if (!token) return {}
  try {
    url = `${DYNAMICS_ENDPOINT}/fsc_certificateattachments`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('Error in getConctact.js', err)
    throw err
  }
}

async function getCertificateAttachmentEndpoint(req, res) {
  res.send(await getCertificateAttachment());
}

module.exports = getCertificateAttachmentEndpoint;
