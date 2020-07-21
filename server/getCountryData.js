const fetch = require('node-fetch');
const getAccessToken = require('./getAccessToken');

const getCountryData = async () => {
  const token = await getAccessToken()
  if (!token) return
  const url =
    'https://fscpreassessmentdemo.api.crm.dynamics.com/api/data/v9.1/fsc_countrydatas';

  try {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    const data = await response.json()
    return data
  } catch (err) {
    console.log('Error in getCountryData.js', err)
    throw err
  }
}

getCountryData()

module.exports = getCountryData;
