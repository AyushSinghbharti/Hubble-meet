import axios from './axios';
import {
  UserProfile,
  CreateUserProfilePayload,
  UpdateUserProfilePayload,
} from '../interfaces/profileInterface';

// Create profile
export const createUserProfile = async (data: CreateUserProfilePayload): Promise<UserProfile> => {
  const response = await axios.post<UserProfile>('/profiles', data);
  return response.data;
};

// Update profile
export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfilePayload
): Promise<UserProfile> => {
  const response = await axios.put<UserProfile>(`/profiles/${userId}`, data);
  return response.data;
};

// Inactivate profile
export const inactivateUserProfile = async (userId: string): Promise<void> => {
  await axios.delete(`/profiles/${userId}`);
};
