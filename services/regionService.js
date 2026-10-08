import api, { unwrap } from './api';

const regionService = {
  list: (params) => unwrap(api.get('/regions', { params })),
  get: (slug) => unwrap(api.get(`/regions/${slug}`)),
  create: (payload) => unwrap(api.post('/regions', payload)),
  update: (id, payload) => unwrap(api.patch(`/regions/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/regions/${id}`)),
};

export default regionService;
