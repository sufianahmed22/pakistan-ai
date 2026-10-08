import api, { unwrap } from './api';

const analyticsService = {
  trackPageView: (payload) => unwrap(api.post('/analytics/pageview', payload)),
  traffic: (params) => unwrap(api.get('/analytics/traffic', { params })),
};

export default analyticsService;
