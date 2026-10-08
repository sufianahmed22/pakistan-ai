import api, { unwrap } from './api';

const searchHistoryService = {
  record: (payload) => unwrap(api.post('/search-history', payload)),
  listRecent: (params) => unwrap(api.get('/search-history', { params })),
};

export default searchHistoryService;
