const fetch = require('node-fetch');
const getAccessToken = require('./getAccessToken');

const getCountryData = getAccessToken().then(token => {
  const url =
    'https://fscpreassessmentdemo.api.crm.dynamics.com/api/data/v9.1/fsc_countrydatas';

  return fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => console.log('data', data));
});

module.exports = getCountryData;
