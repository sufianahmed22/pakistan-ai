import api, { unwrap } from './api';

const savedService = {
  list: (params) => unwrap(api.get('/saved', { params })),
  listIds: () => unwrap(api.get('/saved/ids')),
  check: (entityType, entityId) => unwrap(api.get('/saved/check', { params: { entityType, entityId } })),
  toggle: (entityType, entityId) => unwrap(api.post('/saved/toggle', { entityType, entityId })),
  remove: (id) => unwrap(api.delete(`/saved/${id}`)),
};

export default savedService;
