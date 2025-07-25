import { Platform } from 'react-native';
import api from './axios';
import { getFirebaseToken } from './notification';

export const signup = async (data: {
  email: string;
  phone: string;
}) => {
  const response = await api.post('/api/auth/signup', data);
  return response.data;
};

export const login = async (data: {
  email?: string;
  phone: string;
}) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

export const socialLogin = async (data: {
  provider: string;
  providerId: string;
  email: string;
}) => {
  const deviceType = Platform.OS;
  let fcmToken: string | null = null;

  try {
    fcmToken = await getFirebaseToken();
  } catch (err) {
    console.warn('Failed to get FCM token:', err);
  }

  const enrichedPayload = {
    ...data,
    ...(deviceType === 'ios' || deviceType === 'android' ? { deviceType } : {}),
    ...(fcmToken ? { fcmToken } : {}),
  };

  const response = await api.post('/api/auth/social-login', enrichedPayload);
  return response.data;
};

export const verifyOTP = async (data: {
  phone: string | String,
  userId?: string,
  otp: number | string,
}) => {
  const deviceType = Platform.OS;
  let fcmToken: string | null = null;

  try {
    fcmToken = await getFirebaseToken();
  } catch (err) {
    console.warn('Failed to get FCM token:', err);
  }

  const enrichedPayload = {
    ...data,
    ...(deviceType === 'ios' || deviceType === 'android' ? { deviceType } : {}),
    ...(fcmToken ? { fcmToken } : {}),
  };

  const response = await api.post('/api/auth/verify-otp', enrichedPayload);
  return response.data;
};

export const resendOTP = async (data: {
  phone: string;
}) => {
  const response = await api.post('/api/auth/resend-otp', data);
  return response.data;
};
