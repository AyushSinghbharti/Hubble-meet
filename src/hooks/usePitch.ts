import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  createPitch,
  getUserPitch,
  updatePitch,
  reactToPitch,
} from '../api/pitch';
import { Pitch, PitchFormData, PitchResponse } from '../interfaces/pitchInterface';
import { AxiosError } from 'axios';
import { savePitchIdToStorage, savePitchToStorage } from '../store/localStorage';
import { usePitchStore } from '../store/pitchStore';
import { useEffect } from 'react';

export const useGetUserPitch = (userId: string): UseQueryResult<Pitch, Error> => {
  const setPitch = usePitchStore((state) => state.setPitch);
  const setPitchId = usePitchStore((state) => state.setPitchId);

  const queryResult = useQuery<PitchResponse, Error, Pitch, [string, string]>({
    queryKey: ['pitch', userId],
    queryFn: () => getUserPitch(userId),
    enabled: !!userId,
    refetchInterval: 500,
  });

  useEffect(() => {
    if (queryResult.data) {
      savePitchToStorage(queryResult.data);
      savePitchIdToStorage(queryResult.data.id);
      setPitch(queryResult.data);
      setPitchId(queryResult.data.id);
    }
    if (queryResult.error) {
      const axiosError = queryResult.error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      console.error("Error fetching pitch:", errorMessage);
    }
  }, [queryResult.data, queryResult.error]);

  return queryResult;
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
