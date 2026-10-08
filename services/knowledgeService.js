import api, { unwrap } from './api';

const knowledgeService = {
  list: (params) => unwrap(api.get('/knowledge', { params })),
  get: (id) => unwrap(api.get(`/knowledge/${id}`)),
  update: (id, payload) => unwrap(api.patch(`/knowledge/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/knowledge/${id}`)),
  refresh: (id) => unwrap(api.post(`/knowledge/${id}/refresh`)),
  versions: (id) => unwrap(api.get(`/knowledge/${id}/versions`)),
};

export default knowledgeService;
