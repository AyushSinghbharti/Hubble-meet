import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, signup, socialLogin, resendOTP, verifyOTP } from '../api/auth';
import { useAuthStore } from '../store/auth';

export const useSignup = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      const token = data?.token;
      if (token) {
        await AsyncStorage.setItem('@token', token);
        setToken(token);
      }
    },
  });
};

export const useVerifyOTP = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: async (data) => {
      const token = data?.token;
      if (token) {
        await AsyncStorage.setItem('@token', token);
        setToken(token);
      }
    },
  });
};

export const useResendOTP = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: resendOTP,
    onSuccess: async (data) => {},
  });
};

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      // console.log("login data", data);
      const token = data?.token;
      if (token) {
        await AsyncStorage.setItem('@token', token);
        setToken(token);
      }
    },
  });
};

export const useSocialLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: socialLogin,
    onSuccess: async (data) => {
      // console.log("login via social data", data);
      const token = data?.token;
      if (token) {
        await AsyncStorage.setItem('@token', token);
        setToken(token);
      }
    },
  });
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('@token');

    const setToken = useAuthStore.getState().setToken;
    const clearToken = useAuthStore.getState().clearToken;
    setToken(null);
    clearToken();

    const resetUser = useAuthStore.getState().resetUser;
    resetUser?.();

  } catch (error) {
    console.error('Logout error:', error);
  }
};