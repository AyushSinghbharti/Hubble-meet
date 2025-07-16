import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sendConnectionRequest,
  rejectConnectionRequest,
  removeConnectionRequest,
  acceptConnectionRequest,
  closeConnection,
  blockUser,
  unblockUser,
  getAllConnections,
} from "../api/connection";
import {
  AcceptConnectionRequestBody,
  BlockUserRequestBody,
  CloseConnectionRequestBody,
  GetUserConnectionsRequestBody,
  RejectConnectionRequestBody,
  RemoveRequestBody,
  SendConnectionRequestBody,
  UnblockUserRequestBody,
  ConnectionUser,
} from "../interfaces/connectionInterface";

// Utility handlers (optional: customize per project)
const handleSuccess = (action: string) => {
  console.log(`${action} successful`);
};

const handleError = (action: string, error: any) => {
  console.error(`${action} failed:`, error?.response?.data || error?.message || error);
};

// --- Mutations ---

export const useSendConnection = () =>
  useMutation({
    mutationFn: (data: SendConnectionRequestBody) => sendConnectionRequest(data),
    onSuccess: () => handleSuccess("Send Connection"),
    onError: (error) => handleError("Send Connection", error),
  });

export const useRejectConnection = () =>
  useMutation({
    mutationFn: (data: RejectConnectionRequestBody) => rejectConnectionRequest(data),
    onSuccess: () => handleSuccess("Reject Connection"),
    onError: (error) => handleError("Reject Connection", error),
  });

export const useRemoveConnection = () =>
  useMutation({
    mutationFn: (data: RemoveRequestBody) => removeConnectionRequest(data),
    onSuccess: () => handleSuccess("Remove Connection"),
    onError: (error) => handleError("Remove Connection", error),
  });

export const useAcceptConnection = () =>
  useMutation({
    mutationFn: (data: AcceptConnectionRequestBody) => acceptConnectionRequest(data),
    onSuccess: () => handleSuccess("Accept Connection"),
    onError: (error) => handleError("Accept Connection", error),
  });

export const useCloseConnection = () =>
  useMutation({
    mutationFn: (data: CloseConnectionRequestBody) => closeConnection(data),
    onSuccess: () => handleSuccess("Close Connection"),
    onError: (error) => handleError("Close Connection", error),
  });

export const useBlockUser = () =>
  useMutation({
    mutationFn: (data: BlockUserRequestBody) => blockUser(data),
    onSuccess: () => handleSuccess("Block User"),
    onError: (error) => handleError("Block User", error),
  });

export const useUnblockUser = () =>
  useMutation({
    mutationFn: (data: UnblockUserRequestBody) => unblockUser(data),
    onSuccess: () => handleSuccess("Unblock User"),
    onError: (error) => handleError("Unblock User", error),
  });

// --- Query ---

export const useUserConnections = (userId: string, enabled = true) => {
  const query = useQuery<ConnectionUser[]>({
    queryKey: ["user-connections", userId],
    queryFn: () => getAllConnections({ userId }),
    enabled: !!userId && enabled,
    retry: 1, // Optional: don't retry failed POSTs too aggressively
    gcTime: 0, // Optional: prevent auto garbage collection
  });

  // side effect: handle query state transitions
  if (query.isSuccess) handleSuccess("Fetch Connections");
  if (query.isError) handleError("Fetch Connections", query.error);

  return query;
};