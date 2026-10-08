import api, { unwrap } from './api';

const adminService = {
  overview: () => unwrap(api.get('/analytics/overview')),
  aiAnalytics: () => unwrap(api.get('/analytics/ai')),
  users: (params) => unwrap(api.get('/users', { params })),
  updateUser: (id, payload) => unwrap(api.patch(`/users/${id}`, payload)),
  removeUser: (id) => unwrap(api.delete(`/users/${id}`)),
  telegramUsers: (params) => unwrap(api.get('/admin/telegram-users', { params })),
  logs: (params) => unwrap(api.get('/admin/logs', { params })),
  settings: () => unwrap(api.get('/admin/settings')),
  updateSettings: (payload) => unwrap(api.patch('/admin/settings', payload)),
  contactMessages: (params) => unwrap(api.get('/contact', { params })),
  seoStatus: () => unwrap(api.get('/admin/seo/status')),
  rebuildSeo: () => unwrap(api.post('/admin/seo/rebuild')),
  setUserPassword: (id, password) => unwrap(api.patch(`/users/${id}/password`, { password })),
  developerInfo: () => unwrap(api.get('/developer-info')),
  counts: () => unwrap(api.get('/admin/counts')),
};

export default adminService;
