import api, { unwrap } from './api';

const contactService = {
  // Public / user submit (associates userId automatically if logged in)
  send: (payload) => unwrap(api.post('/contact', payload)),

  // User Dashboard: View personal inquiries and follow up
  listMyMessages: (params) => unwrap(api.get('/contact/my', { params })),
  getMyMessage: (id) => unwrap(api.get(`/contact/my/${id}`)),
  replyToMyMessage: (id, payload) => unwrap(api.post(`/contact/my/${id}/replies`, payload)),

  // Admin Management
  list: (params) => unwrap(api.get('/contact', { params })),
  get: (id) => unwrap(api.get(`/contact/${id}`)),
  update: (id, payload) => unwrap(api.patch(`/contact/${id}`, payload)),
  reply: (id, payload) => unwrap(api.post(`/contact/${id}/replies`, payload)),
};

export default contactService;
