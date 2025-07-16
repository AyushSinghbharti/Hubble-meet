import { useEffect } from 'react';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  createUserProfile,
  updateUserProfile,
  inactivateUserProfile,
  fetchUserProfile,
} from '../api/profile';
import {
  CreateUserProfilePayload,
  UpdateUserProfilePayload,
  UserProfile,
} from '../interfaces/profileInterface';
import { saveUserIdToStorage, saveUserToStorage } from '../store/localStorage';
import { useAuthStore } from '../store/auth';
import { logout } from './useAuth';

//Get User Info
export const useUserProfile = (userId: string): UseQueryResult<UserProfile, Error> => {
  const setUserId = useAuthStore((state) => state.setUserId);
  const setUser = useAuthStore((state) => state.setUser);

  const queryResult = useQuery<UserProfile, Error, UserProfile, [string, string]>({
    queryKey: ['user-profile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (queryResult.data) {
      const data = queryResult.data;
      saveUserIdToStorage(data.user_id);
      saveUserToStorage(data);
      setUserId(data.user_id);
      setUser(data);
    }
  }, [queryResult.data]);
  
  return queryResult;
};

//Get Other User Info (Rather than us)
export const useOtherUserProfile = (userId: string): UseQueryResult<UserProfile, Error> => {
  const queryResult = useQuery<UserProfile, Error, UserProfile, [string, string]>({
    queryKey: ['other-user-profile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (queryResult.data) {
      const data = queryResult.data;
    }
    if(queryResult.error){
      console.log("error fetching other user info", queryResult.error);
    }
  }, [queryResult.data]);
  
  return queryResult;
};

// Create profile
export const useCreateUserProfile = () => {
  const setUserId = useAuthStore((state) => state.setUserId);
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: (data: CreateUserProfilePayload) => createUserProfile(data),
    onSuccess: async (data: UserProfile) => {
      saveUserIdToStorage(data.user_id);
      saveUserToStorage(data);
      setUserId(data.user_id);
      setUser(data);
    }
  });
};

// Update profile
export const useUpdateUserProfile = () => {
  const setUserId = useAuthStore((state) => state.setUserId);
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserProfilePayload }) =>
      updateUserProfile(userId, data),
    onSuccess: async (data: UserProfile) => {
      saveUserIdToStorage(data.user_id);
      saveUserToStorage(data);
      setUserId(data.user_id);
      setUser(data);
      console.log(data);
    }
  });
};

// Inactivate (delete) profile
export const useInactivateUserProfile = () => {
  return useMutation({
    mutationFn: (userId: string) => inactivateUserProfile(userId),
    onSuccess: (data) => {
      logout();
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};
