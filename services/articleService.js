import api, { unwrap } from './api';

const articleService = {
  list: (params) => unwrap(api.get('/articles', { params })),
  get: (slug) => unwrap(api.get(`/articles/${slug}`)),
  create: (payload) => unwrap(api.post('/articles', payload)),
  update: (id, payload) => unwrap(api.patch(`/articles/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/articles/${id}`)),
};

export default articleService;
