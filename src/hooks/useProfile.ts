import { useMutation } from '@tanstack/react-query';
import {
  createUserProfile,
  updateUserProfile,
  inactivateUserProfile,
} from '../api/profile';
import {
  CreateUserProfilePayload,
  UpdateUserProfilePayload,
} from '../interfaces/profileInterface';

// Create profile
export const useCreateUserProfile = () => {
  return useMutation({
    mutationFn: (data: CreateUserProfilePayload) => createUserProfile(data),
  });
};

// Update profile
export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserProfilePayload }) =>
      updateUserProfile(userId, data),
  });
};

// Inactivate (delete) profile
export const useInactivateUserProfile = () => {
  return useMutation({
    mutationFn: (userId: string) => inactivateUserProfile(userId),
  });
};
