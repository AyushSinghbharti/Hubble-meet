import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach Authorization token (skipping /auth routes)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@token');

      const isAuthRoute = config.url?.includes('/api/auth');
      const hasAuthHeader = !!config.headers?.Authorization;

      if (token && !isAuthRoute && !hasAuthHeader) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading token from AsyncStorage:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;