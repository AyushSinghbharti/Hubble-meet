import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPitch,
  getUserPitch,
  updatePitch,
  reactToPitch,
} from '../api/pitch';
import { PitchFormData } from '../interfaces/pitchInterface';
import { AxiosError } from 'axios';
import { savePitchIdToStorage, savePitchToStorage } from '../store/localStorage';
import { usePitchStore } from '../store/pitchStore';

export const useGetUserPitch = (userId: string) => {
  return useQuery({
    queryKey: ['pitch', userId],
    queryFn: () => getUserPitch(userId),
    enabled: !!userId,
  });
};

export const useCreatePitch = () => {
  const setPitch = usePitchStore((state) => state.setPitch);
  const setPitchId = usePitchStore((state) => state.setPitchId);

  return useMutation({
    mutationFn: (data: PitchFormData) => createPitch(data),
    onSuccess: (res) => {
      console.log(res);
      savePitchIdToStorage(res.id);
      setPitchId(res.id);
      savePitchToStorage(res);
      setPitch(res);
    },
    onError: (err: AxiosError) => {
      console.error('Detailed error:', err.response?.data)
      console.error('Error:', err)
    }
  }
  );
};

export const useUpdatePitch = () => {
  const setPitch = usePitchStore((state) => state.setPitch);
  const setPitchId = usePitchStore((state) => state.setPitchId);

  return useMutation({
    mutationFn: ({ pitchId, data }: { pitchId: string; data: Partial<PitchFormData> }) => updatePitch(pitchId, data),
    onSuccess: (res) => {
      console.log(res);
      savePitchIdToStorage(res.id);
      setPitchId(res.id);
      savePitchToStorage(res);
      setPitch(res);
    },
    onError: (err: AxiosError) => {
      console.error('Server said:', err.response?.data)
    }
  });
};

export const useReactToPitch = () => {
  return useMutation({
    mutationFn: ({
      pitchId,
      userId,
    }: {
      pitchId: string;
      userId: string;
    }) => reactToPitch(pitchId, userId),
    onError: (err: AxiosError) => {
      console.error('Server said:', err.response?.data)
    }
  });
};
