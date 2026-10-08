import api, { unwrap } from './api';

const factService = {
  list: (params) => unwrap(api.get('/facts', { params })),
  get: (id) => unwrap(api.get(`/facts/${id}`)),
  create: (payload) => unwrap(api.post('/facts', payload)),
  update: (id, payload) => unwrap(api.patch(`/facts/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/facts/${id}`)),
};

export default factService;
