import api, { unwrap } from './api';

const authService = {
  register: (payload) => unwrap(api.post('/auth/register', payload)),
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  googleLogin: (credential) => unwrap(api.post('/auth/google', { credential })),
  logout: () => unwrap(api.post('/auth/logout')),
  forgotPassword: (email) => unwrap(api.post('/auth/forgot-password', { email })),
  resetPassword: (payload) => unwrap(api.post('/auth/reset-password', payload)),
  me: () => unwrap(api.get('/auth/me')),
  updateProfile: (payload) => unwrap(api.patch('/users/me', payload)),
  setPassword: (payload) => unwrap(api.post('/auth/set-password', payload)),
  changePassword: (payload) => unwrap(api.post('/auth/change-password', payload)),
};

export default authService;
