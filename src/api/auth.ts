import api from './axios';

export const signup = async (data: {
  email: string;
  phone: string;
  termsAccepted: boolean | Boolean;
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
  const response = await api.post('/api/auth/social-login', data);
  return response.data;
};

export const verifyOTP = async (data: {
  userId: string,
  otp: number
}) => {
  const response = await api.post('/api/auth/verify-otp', data);
  return response.data;
};

export const resendOTP = async (data: {
  phone: string;
}) => {
  const response = await api.post('/api/auth/resend-otp', data);
  return response.data;
};
