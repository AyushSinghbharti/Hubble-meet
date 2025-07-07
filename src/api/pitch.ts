import axios from './axios';
import { Pitch, CreatePitchPayload, UpdatePitchPayload } from '../interfaces/pitchInterface';

// 1. Create a pitch
export const createPitch = async (data: CreatePitchPayload): Promise<Pitch> => {
  const response = await axios.post<Pitch>('/api/pitch/create', data);
  return response.data;
};

// 2. Get a pitch by ID
export const getPitchById = async (id: string): Promise<Pitch> => {
  const response = await axios.get<Pitch>(`/api/pitch/getDetail/${id}`);
  return response.data;
};

// 3. Get current user’s pitches
export const getMyPitches = async (): Promise<Pitch[]> => {
  const response = await axios.get<Pitch[]>('/api/pitch/mine');
  return response.data;
};

// 4. Get another user’s pitches
export const getUserPitches = async (userId: string): Promise<Pitch[]> => {
  const response = await axios.get<Pitch[]>(`/api/pitch/user/${userId}`);
  return response.data;
};

// 5. Get recommended pitches
export const getRecommendedPitches = async (): Promise<Pitch[]> => {
  const response = await axios.get<Pitch[]>('/api/pitch/recommended');
  return response.data;
};

// 6. Update a pitch
export const updatePitch = async (id: string, data: UpdatePitchPayload): Promise<Pitch> => {
  const response = await axios.put<Pitch>(`/api/pitch/update/${id}`, data);
  return response.data;
};

// 7. Delete (close) a pitch
export const closePitch = async (id: string): Promise<void> => {
  await axios.put(`/api/pitch/close/${id}`);
};

// 8. Approve pitch (admin only)
export const approvePitch = async (id: string): Promise<void> => {
  await axios.put(`/api/pitch/approve/${id}`);
};
