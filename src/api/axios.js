import axios from 'axios';
import { STORAGE_KEY } from '../constants/authStorageKey.js';

const base = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: base,
});

// Attach token from localStorage (hw_auth => { token, user })
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      // ignore malformed storage
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
