import axios from './axios';
import {
  UserProfile,
  CreateUserProfilePayload,
  UpdateUserProfilePayload,
} from '../interfaces/profileInterface';

//Get user info
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(`/api/user/profiles/${userId}`);
  return response.data;
};

// Create profile
export const createUserProfile = async (data: CreateUserProfilePayload): Promise<UserProfile> => {
  const response = await axios.post<UserProfile>('/api/user/profiles', data);
  console.log("response on axios create user", response);
  return response.data;
};

// Update profile
export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfilePayload
): Promise<UserProfile> => {
  const response = await axios.patch<UserProfile>(`/api/user/profiles/${userId}`, data);
  return response.data;
};

// Inactivate profile
export const inactivateUserProfile = async (userId: string): Promise<void> => {
  await axios.delete(`/api/user/profiles/${userId}`);
};