import axios from 'axios';

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_SERVER_URL
    ? `${import.meta.env.VITE_SERVER_URL.replace(/\/+$/, '')}/api`
    : '') ||
  'http://localhost:5000/api';

export const API_URL = rawApiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap the standard { success, data, message } envelope.
// Components/pages just `await service.fn()` and catch a clean Error.
export function unwrap(promise) {
  return promise
    .then((res) => {
      const body = res?.data;
      if (body && typeof body === 'object' && 'success' in body) {
        if (!body.success) {
          const err = new Error(body.message || 'Request failed');
          err.data = body;
          throw err;
        }
        return body.data;
      }
      return body;
    })
    .catch((err) => {
      if (err.response) {
        const msg = err.response.data?.message || `Request failed (${err.response.status})`;
        const error = new Error(msg);
        error.status = err.response.status;
        error.data = err.response.data;
        throw error;
      }
      if (err.request && !err.message?.includes('Request failed')) {
        throw new Error('Unable to reach the server. Please check your connection.');
      }
      throw err;
    });
}

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  }
);

export default api;
