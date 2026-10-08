import api, { unwrap } from './api';

const conversationService = {
  list: (params) => unwrap(api.get('/conversations', { params })),
  get: (id) => unwrap(api.get(`/conversations/${id}`)),
  remove: (id) => unwrap(api.delete(`/conversations/${id}`)),
};

export default conversationService;
