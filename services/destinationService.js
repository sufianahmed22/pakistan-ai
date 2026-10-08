import api, { unwrap } from './api';

const destinationService = {
  list: (params) => unwrap(api.get('/destinations', { params })),
  get: (slug) => unwrap(api.get(`/destinations/${slug}`)),
  create: (payload) => unwrap(api.post('/destinations', payload)),
  update: (id, payload) => unwrap(api.patch(`/destinations/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/destinations/${id}`)),
};

export default destinationService;
