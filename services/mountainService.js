import api, { unwrap } from './api';

const mountainService = {
  list: (params) => unwrap(api.get('/mountains', { params })),
  get: (slug) => unwrap(api.get(`/mountains/${slug}`)),
  create: (payload) => unwrap(api.post('/mountains', payload)),
  update: (id, payload) => unwrap(api.patch(`/mountains/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/mountains/${id}`)),
};

export default mountainService;
