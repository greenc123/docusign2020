const fetch = require('node-fetch');
const {URLSearchParams} = require('url');

const params = new URLSearchParams();
params.append('resource', 'https://fscpreassessmentdemo.crm.dynamics.com');
params.append('client_id', '232bc5fc-3143-4783-abd3-eaed28124f15');
params.append('grant_type', 'password');
params.append('username', 'service@fscpreassessmentdemo.onmicrosoft.com');
params.append('password', 'ZKHaXIzFwblIUgUXErcdrw7hu9');
params.append('client_secret', 'WUJ6l9iu5I-vUCd689PKyl.BlP_h~tn2yo');

const getAccessToken = async () => {
  const url =
    'https://login.microsoftonline.com/d5912c77-e19e-4140-b57a-7d521b24bc36/oauth2/token';

  try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await response.json()
  return data.access_token
  } catch (err) {
    console.log('Error in getAccessToken.js', err)
    throw err
  }
};

module.exports = getAccessToken
