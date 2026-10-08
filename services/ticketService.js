import api, { unwrap } from './api';

const ticketService = {
  create: (payload) => unwrap(api.post('/tickets', payload)),
  list: (params) => unwrap(api.get('/tickets', { params })),
  get: (id) => unwrap(api.get(`/tickets/${id}`)),
  update: (id, payload) => unwrap(api.patch(`/tickets/${id}`, payload)),
  reply: (id, payload) => unwrap(api.post(`/tickets/${id}/replies`, payload)),
};

export default ticketService;
