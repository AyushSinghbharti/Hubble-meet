import axios from './axios';
import {
  VbcCard,
  CreateVbcPayload,
  UpdateVbcPayload,
  ShareVbcPayload,
} from '../interfaces/vbcInterface';

// Get VBC card
export const getVbcCard = async (id: string): Promise<VbcCard> => {
  const response = await axios.get<VbcCard>(`/api/vbc/card/${id}`);
  return response.data;
};

// Create new VBC card
export const createVbcCard = async (data: CreateVbcPayload): Promise<VbcCard> => {
  const response = await axios.post<VbcCard>('/api/vbc/card', data);
  return response.data;
};

// Update an existing VBC card
export const updateVbcCard = async (id: string, data: UpdateVbcPayload): Promise<VbcCard> => {
  const response = await axios.put<VbcCard>(`/api/vbc/card/${id}`, data);
  return response.data;
};

// Delete an existing VBC card
export const deleteVbcCard = async (id: string): Promise<VbcCard> => {
  const response = await axios.delete<VbcCard>(`/api/vbc/card/${id}`);
  return response.data;
};

// Share a VBC card
export const shareVbcCard = async (data: ShareVbcPayload): Promise<void> => {
  await axios.post('/api/vbc/card/share', data);
};