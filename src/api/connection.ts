import axios from './axios';
import {
    CreateConnectionPayload,
    RemoveConnectionPayload,
    RejectConnectionPayload,
    CloseConnectionPayload,
    RecommendedUser,
} from '../interfaces/connectionInterface';

// Create a connection
export const createConnection = async (data: CreateConnectionPayload): Promise<void> => {
    await axios.post('/connections/make', data);
};

// Remove an existing connection
export const removeConnection = async (data: RemoveConnectionPayload): Promise<void> => {
    await axios.delete('/connections/request/remove', { data });
};

// Cancel or reject a connection request
export const rejectConnectionRequest = async (data: RejectConnectionPayload): Promise<void> => {
    await axios.post('/connections/request/reject', data);
};

// Close a connection
export const closeConnection = async (data: CloseConnectionPayload): Promise<void> => {
    await axios.post('/connections/close', data);
};

// Get recommended users
export const getRecommendedUsers = async (): Promise<RecommendedUser[]> => {
    const response = await axios.get<RecommendedUser[]>('/connections/recommend');
    return response.data;
};
