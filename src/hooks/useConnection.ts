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
  getConnectionRequests,
  getRecommendedProfiles,
  searchUserProfile,
  getAllConnectionVbcs,
  searchUserVbc,
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
  ConnectionRequest,
  SearchInterface,
  Recommendations,
  SearchUserResponse,
  ConnectionVbc,
  GetVbcConnectionsRequestBody,
  SearchVBCResponse,
} from "../interfaces/connectionInterface";
import { useConnectionStore } from "../store/connectionStore";
import { saveConnectionsToStorage, saveConnectionVbcsToStorage } from "../store/localStorage";
import { useEffect } from "react";

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
  const setConnections = useConnectionStore((state) => state.setConnections);
  const query = useQuery<ConnectionUser[]>({
    queryKey: ["user-connections", userId],
    queryFn: () => getAllConnections({ userId }),
    enabled: !!userId && enabled,
    retry: 1, // Optional: don't retry failed POSTs too aggressively
    gcTime: 0, // Optional: prevent auto garbage collection
    refetchInterval: 1000, //Optional: fetch data after 0.5 sec
  });

  useEffect(() => {
    if (query.data) {
      setConnections(query.data);
      saveConnectionsToStorage(query.data);
      handleSuccess("Fetch Connections");
    }
    if (query.error) {
      handleError("Fetch Connections", query.error);;
    }
  }, [query.data, query.error]);

  return query;
};

export const useUserConnectionVbcs = (data: GetVbcConnectionsRequestBody) => {
  const setConnectionVbcs = useConnectionStore((state) => state.setConnectionVbcs);
  const query = useQuery<ConnectionVbc[]>({
    queryKey: ["user-connections", data.userId],
    queryFn: () => getAllConnectionVbcs(data),
    enabled: !!data.userId,
    retry: 1, // Optional: don't retry failed POSTs too aggressively
    gcTime: 0, // Optional: prevent auto garbage collection
    refetchInterval: 1000, //Optional: fetch data after 0.5 sec
  });

  useEffect(() => {
    if (query.data) {
      setConnectionVbcs(query.data);
      saveConnectionVbcsToStorage(query.data);
      handleSuccess("Fetch Connections");
    }
    if (query.error) {
      handleError("Fetch Connections", query.error);;
    }
  }, [query.data, query.error]);

  return query;
};


export const useConnectionRequests = ({ userId, enabled = true }: { userId: string, enabled?: boolean }) => {
  const setRequests = useConnectionStore((state) => state.setRequests);
  const setSentRequests = useConnectionStore((state) => state.setSentRequests);
  const query = useQuery<ConnectionRequest[]>({
    queryKey: ["connection-requests", userId],
    queryFn: () => getConnectionRequests({userId}),
    enabled: !!userId && enabled,
    retry: 1, // Optional: don't retry failed POSTs too aggressively
    gcTime: 0, // Optional: prevent auto garbage collection
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: true,
    refetchInterval: 1000, //Optional: fetch data after 1 sec
  });

  useEffect(() => {
    if (query.data) {
      const received = query.data.filter(
        (req) => req.request_status === "RECEIVED"
      );
      const sent = query.data.filter(
        (req) => req.request_status !== "RECEIVED"
      );
      setRequests(received.reverse());
      setSentRequests(sent.reverse());
      console.log("Fetch request successfull");
    }
    if (query.error) {
      console.error("Error fetching requests/sent by ID:", query.error);
    }
  }, [query.data, query.error]);

  return query;
};


//Get recommendations:
export const useRecommendedProfiles = (userId: string, enabled = true) => {
  const addRecommendationsIdBulk = useConnectionStore((s) => s.addRecommendationsIdBulk);

  const query = useQuery<Recommendations>({
    queryKey: ["recommended-profiles", userId],
    queryFn: () => getRecommendedProfiles(userId),
    enabled: !!userId && enabled,
    retry: 1,
    gcTime: 0,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (query.data) {
      console.log(query.data);
      addRecommendationsIdBulk(query.data.recommendations);
    }

    if (query.error) {
      console.error("Error fetching recommended profiles:", query.error);
    }
  }, [query.data, query.error]);

  return query;
};

//Search User Globally
export const useSearchUser = (data: SearchInterface, enabled = true) => {
  const query = useQuery<SearchUserResponse>({
    queryKey: ["search-profiles", data.searchText],
    queryFn: () => searchUserProfile(data),
    enabled: !!data && enabled,
    retry: 1,
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      console.log(query.data);
    }

    if (query.error) {
      console.error("Error fetching recommended profiles:", query.error);
    }
  }, [query.data, query.error]);

  return query;
};

//Search VBC Globally
export const useSearchVBC = (data: SearchInterface, enabled = true) => {
  const query = useQuery<SearchVBCResponse>({
    queryKey: ["search-profiles", data.searchText],
    queryFn: () => searchUserVbc(data),
    enabled: !!data && enabled,
    retry: 1,
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      console.log(query.data);
    }

    if (query.error) {
      console.error("Error fetching recommended profiles:", query.error);
    }
  }, [query.data, query.error]);

  return query;
};
