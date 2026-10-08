import api, { unwrap } from './api';

// Each endpoint returns records shaped like { value, year, source } (or arrays of
// such records) — never assume a single bare number. Consumers must render
// value/year/source together per the "as of <year>" requirement.
const statisticsService = {
  population: (params) => unwrap(api.get('/statistics/population', { params })),
  provinces: (params) => unwrap(api.get('/statistics/provinces', { params })),
  rivers: (params) => unwrap(api.get('/statistics/rivers', { params })),
  mountains: (params) => unwrap(api.get('/statistics/mountains', { params })),
  economy: (params) => unwrap(api.get('/statistics/economy', { params })),
  demographics: (params) => unwrap(api.get('/statistics/demographics', { params })),
};

export default statisticsService;
