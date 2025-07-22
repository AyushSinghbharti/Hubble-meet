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
    SearchInterface,
    Recommendations,
    SearchUserResponse,
    GetVbcConnectionsRequestBody,
    ConnectionVbc,
    SearchVBCResponse,
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

// Get All VBC (for the user)
export const getAllConnectionVbcs = async (
    data: GetVbcConnectionsRequestBody
): Promise<ConnectionVbc[]> => {
    const res = await api.post("/api/connection/all/", data);
    return res.data;
};

//Get all requests
export const getConnectionRequests = async (userId: string): Promise<ConnectionRequest[]> => {
    const response = await api.post(`/api/connection/requests/`, userId  );
    return response.data;
};

//Get recommended profiles
export const getRecommendedProfiles = async (
  userId: string
): Promise<Recommendations> => {
  const response = await api.get(`/api/user/profiles/${userId}/recommendations`);
  return response.data;
};

//Search User profiles
export const searchUserProfile = async (data: SearchInterface): Promise<SearchUserResponse> => {
  const response = await api.post(`/api/user/profiles/search/users`, data);
  return response.data;
};

//Search VBC profiles
export const searchUserVbc = async (data: SearchInterface): Promise<SearchVBCResponse> => {
  const response = await api.post(`/api/user/profiles/search/users`, data);
  return response.data;
};
export const addCloseCircle = async (data: any): Promise<any> => {
  const response = await api.post(`/api/connection/close`, data);
  return response.data;
};
export const getCloseCircle = async (data: any): Promise<any> => {
  const response = await api.post(`/api/connection/close-circle`, data);
  console.log(response.data, "response of the close circle");
  return response.data;
}; 