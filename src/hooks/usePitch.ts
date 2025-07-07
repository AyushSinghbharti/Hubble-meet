import { useQuery, useMutation } from '@tanstack/react-query';
import * as pitchApi from '../api/pitch';
import {
  Pitch,
  CreatePitchPayload,
  UpdatePitchPayload,
} from '../interfaces/pitchInterface';
import { usePitchStore } from '../store/pitchStore';

// Fetch all recommended pitches
export const useRecommendedPitches = () => {
  const setPitches = usePitchStore((state) => state.setPitches);
  return useQuery({
    queryKey: ['recommended-pitches'],
    queryFn: pitchApi.getRecommendedPitches,
    onSuccess: (data) => setPitches(data),
  });
};

// Fetch current user's pitches
export const useMyPitches = () => {
  return useQuery({
    queryKey: ['my-pitches'],
    queryFn: pitchApi.getMyPitches,
  });
};

// Fetch another user's pitches
export const useUserPitches = (userId: string) => {
  return useQuery({
    queryKey: ['user-pitches', userId],
    queryFn: () => pitchApi.getUserPitches(userId),
  });
};

// Fetch a pitch by ID
export const usePitchById = (id: string) => {
  return useQuery({
    queryKey: ['pitch', id],
    queryFn: () => pitchApi.getPitchById(id),
  });
};

// Create a new pitch
export const useCreatePitch = () => {
  const addPitch = usePitchStore((state) => state.addPitch);
  return useMutation({
    mutationFn: (payload: CreatePitchPayload) => pitchApi.createPitch(payload),
    onSuccess: (data) => addPitch(data),
  });
};

// Update a pitch
export const useUpdatePitch = () => {
  const updatePitch = usePitchStore((state) => state.updatePitch);
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePitchPayload;
    }) => pitchApi.updatePitch(id, payload),
    onSuccess: (data) => updatePitch(data),
  });
};

// Close/Delete a pitch
export const useClosePitch = () => {
  const setPitches = usePitchStore((state) => state.setPitches);
  return useMutation({
    mutationFn: (id: string) => pitchApi.closePitch(id),
    onSuccess: async () => {
      const refreshed = await pitchApi.getMyPitches();
      setPitches(refreshed);
    },
  });
};

// Approve a pitch (admin)
export const useApprovePitch = () => {
  return useMutation({
    mutationFn: (id: string) => pitchApi.approvePitch(id),
  });
};
