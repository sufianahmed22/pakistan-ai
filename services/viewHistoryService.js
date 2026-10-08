import api, { unwrap } from './api';

const viewHistoryService = {
  record: (entityType, entityId) => unwrap(api.post('/view-history', { entityType, entityId })),
  listRecent: (params) => unwrap(api.get('/view-history', { params })),
};

export default viewHistoryService;
