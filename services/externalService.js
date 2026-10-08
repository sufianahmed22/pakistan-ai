import api, { unwrap } from './api';

const externalService = {
  getWeather: (lat, lng) => unwrap(api.get('/weather', { params: { lat, lng } })),
  getCurrencyRates: () => unwrap(api.get('/currency')),
  getHolidays: (year, month) => unwrap(api.get('/holidays', { params: { year, month } })),
  getRecentEarthquakes: () => unwrap(api.get('/earthquakes')),
  getAirQuality: (lat, lng) => unwrap(api.get('/air-quality', { params: { lat, lng } })),
  getCountryProfile: () => unwrap(api.get('/country-profile')),
};

export default externalService;
