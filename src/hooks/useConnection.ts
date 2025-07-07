import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createConnection,
  removeConnection,
  rejectConnectionRequest,
  closeConnection,
  getRecommendedUsers,
} from '../api/connection';
import {
  CreateConnectionPayload,
  RemoveConnectionPayload,
  RejectConnectionPayload,
  CloseConnectionPayload,
  RecommendedUser,
} from '../interfaces/connectionInterface';

// Create a new connection
export const useCreateConnection = () => {
  return useMutation({
    mutationFn: (data: CreateConnectionPayload) => createConnection(data),
  });
};

// Remove existing connection
export const useRemoveConnection = () => {
  return useMutation({
    mutationFn: (data: RemoveConnectionPayload) => removeConnection(data),
  });
};

// Reject/Ignore a request
export const useRejectConnection = () => {
  return useMutation({
    mutationFn: (data: RejectConnectionPayload) => rejectConnectionRequest(data),
  });
};

// Close an existing connection
export const useCloseConnection = () => {
  return useMutation({
    mutationFn: (data: CloseConnectionPayload) => closeConnection(data),
  });
};

// Get recommended users
export const useRecommendedUsers = () => {
  return useQuery<RecommendedUser[], Error>({
    queryKey: ['recommended-users'],
    queryFn: getRecommendedUsers,
  });
};
