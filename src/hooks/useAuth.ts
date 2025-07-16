import { useMutation } from '@tanstack/react-query';
import { login, signup, socialLogin, resendOTP, verifyOTP } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { saveTokenToStorage, removeTokenFromStorage, removeUserFromStorage, saveUserIdToStorage } from '../store/localStorage';

export const useSignup = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      console.log(data);
    },
  });
};

export const useVerifyOTP = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setUserId = useAuthStore((state) => state.setUserId);

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: async (data) => {
      const user: { id: string, email: string, phone: string } = data.user;
      setUser(user);
      setUserId(user.id);
      const token = data?.token;

      if (token) {
        saveTokenToStorage(token);
        saveUserIdToStorage(user.id);
        setToken(token);
      }
      console.log(data);
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,
    onSuccess: async (data) => {
      console.log(data);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log(data);
    },
  });
};

export const useSocialLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUserId = useAuthStore((state) => state.setUserId);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: socialLogin,
    onSuccess: async (data) => {
      const token = data?.token;
      if (token) {
        console.log(JSON.stringify(data, null, 2))
        saveTokenToStorage(token);
        setToken(token);
        saveUserIdToStorage(data.user.id);
        setUserId(data.user.id);
      }
      console.log(data);
    },
  });
};

export const logout = async () => {
  try {
    removeTokenFromStorage();
    removeUserFromStorage({ removeId: true });

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