import api, { unwrap } from './api';

// Historical Event ("timeline") entries. Note: this backend has no
// GET /history/:id — list rows already carry the full record, so edits
// use the row's own data as initialValues rather than fetching by id.
const historyService = {
  list: (params) => unwrap(api.get('/history', { params })),
  create: (payload) => unwrap(api.post('/history', payload)),
  update: (id, payload) => unwrap(api.patch(`/history/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/history/${id}`)),
};

export default historyService;
