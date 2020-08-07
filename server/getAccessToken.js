const fetch = require('node-fetch');
const {URLSearchParams} = require('url');
const process = require('process')
require('dotenv').config();

const params = new URLSearchParams();
const {
  DYNAMICS_SERVICE_USER,
  DYNAMICS_CLIENT_ID,
  DYNAMICS_PASSWORD,
  DYNAMICS_CLIENT_SECRET,
  DYNAMICS_RESOURCE,
  DYNAMICS_TENANT_ID
} = process.env;

params.append('username', DYNAMICS_SERVICE_USER);
params.append('client_id', DYNAMICS_CLIENT_ID);
params.append('password', DYNAMICS_PASSWORD);
params.append('client_secret', DYNAMICS_CLIENT_SECRET);
params.append('resource', DYNAMICS_RESOURCE);
params.append('grant_type', 'password');

const getAccessToken = async () => {
    const url = `https://login.microsoftonline.com/${DYNAMICS_TENANT_ID}/oauth2/token`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.log('Error in getAccessToken.js', err);
    throw err;
  }
};

module.exports = getAccessToken;
