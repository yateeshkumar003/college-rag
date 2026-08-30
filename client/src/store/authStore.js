import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Clear any existing error state
  clearError: () => set({ error: null }),

  // Load user profile using cached token
  loadUser: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const res = await api.get('/auth/me');
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false
      });
      return res.data.data;
    } catch (err) {
      console.error('Error loading user profile:', err);
      // If token is invalid or expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || 'Session expired. Please log in again.'
      });
      return null;
    }
  },

  // Log in student or admin
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }

      set({
        token,
        user: userData,
        isAuthenticated: true,
        loading: false
      });
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  // Register student account
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = res.data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }

      set({
        token,
        user: userData,
        isAuthenticated: true,
        loading: false
      });
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  // Logout session
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  }
}));
