import api from "./axios";
import {
    SendConnectionRequestBody,
    RejectConnectionRequestBody,
    RemoveRequestBody,
    AcceptConnectionRequestBody,
    CloseConnectionRequestBody,
    BlockUserRequestBody,
    UnblockUserRequestBody,
    GetUserConnectionsRequestBody,
    ConnectionUser,
    DefaultSuccessResponse,
    ErrorResponse,
    ConnectionRequest,
} from "../interfaces/connectionInterface";

// Send Connection Request
export const sendConnectionRequest = async (data: SendConnectionRequestBody): Promise<DefaultSuccessResponse> => {
    const res = await api.post("/api/connection/request", data);
    return res.data;
};

// Reject Connection Request
export const rejectConnectionRequest = async (data: RejectConnectionRequestBody): Promise<DefaultSuccessResponse> => {
    const res = await api.post("/api/connection/request/reject", data);
    return res.data;
};

// Remove Sent Request
export const removeConnectionRequest = async (data: RemoveRequestBody): Promise<void> => {
    await api.post("/api/connection/request/remove", data);
};

// Accept / Make Connection
export const acceptConnectionRequest = async (data: AcceptConnectionRequestBody): Promise<void> => {
    await api.post("/api/connection/make", data);
};

// Close Existing Connection
export const closeConnection = async (data: CloseConnectionRequestBody): Promise<void> => {
    await api.post("/api/connection/close", data);
};

// Block User
export const blockUser = async (data: BlockUserRequestBody): Promise<void> => {
    await api.post("/api/connection/block", data);
};

// Unblock User
export const unblockUser = async (data: UnblockUserRequestBody): Promise<DefaultSuccessResponse | ErrorResponse> => {
    const res = await api.post("/api/connection/unblock", data);
    return res.data;
};

// Get All Connections (for a user)
export const getAllConnections = async (
    data: GetUserConnectionsRequestBody
): Promise<ConnectionUser[]> => {
    const res = await api.post("/api/connection/all/", data);
    return res.data;
};

//Get all requests
export const getConnectionRequests = async (userId: string): Promise<ConnectionRequest[]> => {
    const response = await api.get(`api/connection/requests`, {
        params: { userId },
    });
    return response.data;
};

//Get recommended profiles
export const getRecommendedProfiles = async (
  userId: string
): Promise<ConnectionUser[]> => {
  const response = await api.get(`/user/profiles/${userId}/recommendations`);
  return response.data;
};