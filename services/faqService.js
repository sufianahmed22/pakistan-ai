import api, { unwrap } from './api';

const faqService = {
  list: (params) => unwrap(api.get('/faqs', { params })),
  get: (id) => unwrap(api.get(`/faqs/${id}`)),
  create: (payload) => unwrap(api.post('/faqs', payload)),
  update: (id, payload) => unwrap(api.patch(`/faqs/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/faqs/${id}`)),
};

export default faqService;
