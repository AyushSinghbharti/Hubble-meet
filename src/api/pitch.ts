import api from './axios';
import { Pitch, PitchFormData, PitchResponse } from '../interfaces/pitchInterface';

// Get pitch details for a user
export const getUserPitch = async (userId: string): Promise<PitchResponse> => {
  const response = await api.get(`/api/pitch/getDetails/${userId}`);
  return response.data.data;
};

// Create a new pitch
export const createPitch = async (data: PitchFormData): Promise<Pitch> => {
  const formData = new FormData();

  formData.append('video', {
    uri: data.video.uri,
    name: data.video.name ?? `${data.user_id}_updated_pitch _${Date.now().toString()}.mp4`,
    type: data.video.type ?? 'video/mp4',
  } as any);
  formData.append('user_id', data.user_id);
  formData.append('display_name', data.display_name);
  formData.append('pitch_caption', data.pitch_caption);

  const response = await api.post('/api/pitch/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};


// Update an existing pitch
export const updatePitch = async (
  pitchId: string,
  data: Partial<PitchFormData>
): Promise<Pitch> => {

  const formData = new FormData();
  if (data.video) {
    formData.append('video', {
      uri: data.video.uri,
      name: data.video.name ?? `${data.user_id}_updated_pitch _${Date.now().toString()}.mp4`,
      type: data.video.type ?? 'video/mp4',
    } as any);
  }
  if (data.display_name) formData.append('display_name', data.display_name);
  if (data.pitch_caption) formData.append('pitch_caption', data.pitch_caption);

  const response = await api.put(`/api/pitch/update/${pitchId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// React to a pitch (like)
export const reactToPitch = async (pitchId: string, userId: string) => {
  const response = await api.post(`/api/pitch/${pitchId}/reaction`, {
    userId,
  });
  return response.data;
};

//Report Pitch
export const reportPitch = async (pitch_id: string, user_id: string, owner_id: string) => {
  const response = await api.post(`/api/pitch/report`, {
    user_id,
    pitch_id,
    owner_id
  });
  return response.data;
};

// //Delete Pitch
export const deletePitch = async (pitchId: string) => {
  const response = await api.delete(`/api/pitch/delete/${pitchId}`);
  return response.data;
};