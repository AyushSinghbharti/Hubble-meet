import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pitch,
  CreatePitchPayload,
  UpdatePitchPayload,
  ReactToPitchPayload,
  PitchWithLikeStatus,
} from '../interfaces/pitchInterface';

export const createPitch = async (formData: FormData): Promise<Pitch> => {
  const res = await axios.post('/api/pitch/create', formData);
  console.log("res", res);
  return res.data.data;
};

export const getPitchByUserId = async (userId: string): Promise<Pitch> => {
  const res = await axios.get(`/api/pitch/getDetails/${userId}`);
  return res.data.data;
};

export const updatePitch = async (
  pitchId: string,
  data: UpdatePitchPayload
): Promise<Pitch> => {
  const res = await axios.put(`/api/pitch/update/${pitchId}`);
  return res.data.data;
};

export const reactToPitch = async (
  pitchId: string,
  data: ReactToPitchPayload
): Promise<string> => {
  const res = await axios.post(`/api/pitch/${pitchId}/reaction`, data);
  return res.data.message;
};

export const getPitchList = async (
  targetUserIds: string[],
  currentUserId?: string
): Promise<(string | PitchWithLikeStatus)[]> => {
  const params = new URLSearchParams();
  targetUserIds.forEach((id) => params.append('targetUserId', id));
  if (currentUserId) params.append('userId', currentUserId);
  const res = await axios.get(`/api/pitch/getDetails?${params}`);
  return res.data.data;
};
