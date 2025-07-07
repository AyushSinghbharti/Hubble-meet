import axios from './axios';
import {
  VbcCard,
  CreateVbcPayload,
  UpdateVbcPayload,
  ShareVbcPayload,
} from '../interfaces/vbcInterface';

// Create new VBC card
export const createVbcCard = async (data: CreateVbcPayload): Promise<VbcCard> => {
  const response = await axios.post<VbcCard>('/vbc/card', data);
  return response.data;
};

// Update an existing VBC card
export const updateVbcCard = async (id: string, data: UpdateVbcPayload): Promise<VbcCard> => {
  const response = await axios.put<VbcCard>(`/vbc/card/${id}`, data);
  return response.data;
};

// Share a VBC card
export const shareVbcCard = async (data: ShareVbcPayload): Promise<void> => {
  await axios.post('/vbc/card/share', data);
};