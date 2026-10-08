import api, { unwrap } from './api';

const riverService = {
  list: (params) => unwrap(api.get('/rivers', { params })),
  get: (slug) => unwrap(api.get(`/rivers/${slug}`)),
  create: (payload) => unwrap(api.post('/rivers', payload)),
  update: (id, payload) => unwrap(api.patch(`/rivers/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/rivers/${id}`)),
};

export default riverService;
