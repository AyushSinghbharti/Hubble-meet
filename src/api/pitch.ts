import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pitch,
  CreatePitchPayload,
  UpdatePitchPayload,
  ReactToPitchPayload,
  PitchWithLikeStatus,
} from '../interfaces/pitchInterface';

const withAuth = async () => {
  const token = await AsyncStorage.getItem('@token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createPitch = async (formData: FormData): Promise<Pitch> => {
  const config = await withAuth();
  const res = await axios.post('/api/pitch/create', formData, config);
  console.log("res", res);
  return res.data.data;
};

export const getPitchByUserId = async (userId: string): Promise<Pitch> => {
  // const config = await withAuth();
  const res = await axios.get(`/api/pitch/getDetails/${userId}`);
  return res.data.data;
};

export const updatePitch = async (
  pitchId: string,
  data: UpdatePitchPayload
): Promise<Pitch> => {
  const config = await withAuth();
  const res = await axios.put(`/api/pitch/update/${pitchId}`, data, config);
  return res.data.data;
};

export const reactToPitch = async (
  pitchId: string,
  data: ReactToPitchPayload
): Promise<string> => {
  const config = await withAuth();
  const res = await axios.post(`/api/pitch/${pitchId}/reaction`, data, config);
  return res.data.message;
};

export const getPitchList = async (
  targetUserIds: string[],
  currentUserId?: string
): Promise<(string | PitchWithLikeStatus)[]> => {
  const config = await withAuth();
  const params = new URLSearchParams();
  targetUserIds.forEach((id) => params.append('targetUserId', id));
  if (currentUserId) params.append('userId', currentUserId);
  const res = await axios.get(`/api/pitch/getDetails?${params}`, config);
  return res.data.data;
};
