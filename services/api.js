import axios from 'axios';

// Auth token storage - a fallback alongside the httpOnly cookie the backend
// also sets. Cookie-only auth is cross-site (frontend and backend are on
// different domains per docker-compose.yml), and mobile browsers (iOS
// Safari, Chrome on Android) are far stricter than desktop about accepting
// and resending SameSite=None cross-site cookies - that's why mobile users
// were getting bounced back to login a couple seconds after landing on the
// dashboard (the cookie silently wasn't sent on one of the dashboard's
// background API calls, which 401'd and logged them out). The backend's
// requireAuth middleware already accepts `Authorization: Bearer <token>` as
// an alternative to the cookie (see Backend/middleware/authMiddleware.js) -
// this just makes the frontend actually use it, so auth no longer depends
// on the cookie surviving on mobile.
const TOKEN_STORAGE_KEY = 'pk_ai_token';

let authToken = null;
try {
  authToken = localStorage.getItem(TOKEN_STORAGE_KEY) || null;
} catch {
  // localStorage can throw in some privacy modes - fall back to cookie-only auth.
}

export function setAuthToken(token) {
  authToken = token || null;
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore - in-memory token still works for the current page load
  }
}

export function getAuthToken() {
  return authToken;
}

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

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  }
);

export default api;
