import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPitch,
  getPitchByUserId,
  updatePitch,
  reactToPitch,
  getPitchList,
} from '../api/pitch';
import {
  UpdatePitchPayload,
  ReactToPitchPayload,
  PitchWithLikeStatus,
  Pitch,
} from '../interfaces/pitchInterface';

// Create pitch
export const useCreatePitch = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createPitch(formData),
  });
};

// Get pitch by user ID
export const usePitchByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['pitch', userId],
    queryFn: () => getPitchByUserId(userId),
  });
};

// Update pitch
export const useUpdatePitch = () => {
  return useMutation({
    mutationFn: ({ pitchId, data }: { pitchId: string; data: UpdatePitchPayload }) =>
      updatePitch(pitchId, data),
  });
};

// Like/unlike pitch
export const useReactToPitch = () => {
  return useMutation({
    mutationFn: ({ pitchId, data }: { pitchId: string; data: ReactToPitchPayload }) =>
      reactToPitch(pitchId, data),
  });
};

// Get multiple pitch URLs
export const usePitchList = (targetUserIds: string[], currentUserId?: string) => {
  return useQuery<(string | PitchWithLikeStatus)[]>({
    queryKey: ['pitch-list', targetUserIds, currentUserId],
    queryFn: () => getPitchList(targetUserIds, currentUserId),
  });
};
