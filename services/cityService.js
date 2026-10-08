import api, { unwrap } from './api';

const cityService = {
  list: (params) => unwrap(api.get('/cities', { params })),
  get: (slug) => unwrap(api.get(`/cities/${slug}`)),
  create: (payload) => unwrap(api.post('/cities', payload)),
  update: (id, payload) => unwrap(api.patch(`/cities/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/cities/${id}`)),
};

export default cityService;
