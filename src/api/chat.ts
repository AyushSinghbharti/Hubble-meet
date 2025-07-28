/* src/api/chat.ts
 * Axios service layer for chat-related API calls
 */

import apiClient from './axios';
import {
    CreateChatRequest,
    CreateChatResponse,
    GetChatByIdResponse,
    GetUserChatsResponse,
    AddUserToChatResponse,
    RemoveUserFromChatResponse,
    SendMessageRequest,
    SendMessageResponse,
    GetChatMessagesResponse,
    DeleteMessageResponse,
    SendMediaRequest,
    DeleteMessageRequest,
    GetAllChatMessageRequestPayload,
} from '../interfaces/chatInterface';

const CHAT_BASE = '/api/chat';

/**
 * Creates a new chat (1-to-1 or group)
 */
export const createChat = (
    data: CreateChatRequest
): Promise<CreateChatResponse> =>
    apiClient.post<CreateChatResponse>(`${CHAT_BASE}/create`, data).then(res => res.data);

/**
 * Retrieves a chat by its ID
 */
export const getChatById = (
    chatId: string
): Promise<GetChatByIdResponse> =>
    apiClient.get<GetChatByIdResponse>(`${CHAT_BASE}/${chatId}`).then(res => res.data);

/**
 * Fetches all chats for a given user
 */
export const getUserChats = (
    userId: string
): Promise<GetUserChatsResponse> =>
    apiClient.get<GetUserChatsResponse>(`${CHAT_BASE}/user/${userId}`).then(res => res.data);

/**
 * Adds a user to an existing chat
 */
export const addUserToChat = (
    chatId: string,
    userId: string
): Promise<AddUserToChatResponse> =>
    apiClient.put<AddUserToChatResponse>(`${CHAT_BASE}/${chatId}/users/${userId}`).then(res => res.data);

/**
 * Removes a user from an existing chat
 */
export const removeUserFromChat = (
    chatId: string,
    userId: string
): Promise<RemoveUserFromChatResponse> =>
    apiClient.delete<RemoveUserFromChatResponse>(`${CHAT_BASE}/${chatId}/users/${userId}`).then(res => res.data);

/**
 * Sends a message (text/file/vCard)
 */
export const sendMessage = (
    payload: SendMessageRequest
): Promise<SendMessageResponse> =>
    apiClient.post<SendMessageResponse>(`${CHAT_BASE}/send`, payload).then(res => res.data);

//Send Media (document/image etc...)
export const sendMedia = async (
    payload: SendMediaRequest
): Promise<SendMessageResponse> => {
    const formData = new FormData();

    formData.append("content", payload.content || "");
    formData.append("chat", JSON.stringify(payload.chat));
    formData.append("sender", JSON.stringify(payload.sender));
    formData.append("messageType", payload.messageType);

    // Handle multiple files
    payload.files.forEach((file, index) => {
        const fileBlob = {
            uri: file.uri,
            type: file.type || "application/octet-stream",
            name: file.name || `upload_${index}`,
        };

        formData.append("files", fileBlob as any, file.name || `upload_${index}`);
    });

    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
        },
    };

    try {
        const response = await apiClient.post<SendMessageResponse>(
            `${CHAT_BASE}/send`,
            formData,
            config
        );
        return response.data;
    } catch (error) {
        console.error("Axios upload error:", error);
        throw error;
    }
};

/**
 * Retrieves all messages in a chat
 */
export const getChatMessages = (
    chatId: string,
    data: GetAllChatMessageRequestPayload
): Promise<GetChatMessagesResponse> =>
    apiClient.post<GetChatMessagesResponse>(`${CHAT_BASE}/msg/${chatId}`, data).then(res => res.data);

export const chatApi = {
    getMessages: (
        chatId: string,
        body: { userId: string; page: number; limit: number }
    ) => apiClient.post(`/api/chat/msg/${chatId}`, body),
};
/**
 * Deletes a specific message by its ID
 */
export const deleteMessageforme = (
    messageId: string,
    userId: string
): Promise<DeleteMessageResponse> =>
    apiClient.post<DeleteMessageResponse>(`${CHAT_BASE}/${messageId}/deleteforme`, { userId }).then(res => res.data);

export const deleteMessageforeveryone = (
    messageId: string,
    userId: string
): Promise<DeleteMessageResponse> =>
    apiClient.post<DeleteMessageResponse>(`${CHAT_BASE}/${messageId}/deleteForEveryone`, { userId }).then(res => res.data);

/**
 * star a specific message by its ID
*/
// ⭐ Star a message
export const starMessage = (messageId: string, userId: string) =>
    apiClient.post(`${CHAT_BASE}/${messageId}/star`, { userId });

// ❌ Unstar a message
export const unStarMessage = (messageId: string, userId: string) =>
    apiClient.post(`${CHAT_BASE}/${messageId}/unstar`, { userId });

// ⭐⭐ Get starred messages
export const getStarredMessages = (userId: string) =>
    apiClient.get(`${CHAT_BASE}/starred/${userId}`).then(res => res.data);

// ✅ Clear all messages for user from a chat
export const clearChat = (chatId: string, userId: string) =>
    apiClient.post(`${CHAT_BASE}/${chatId}/clear`, { userId }).then(res => res.data);

// ❌ Delete chat entirely for user (same endpoint as clearChat as per your info)
export const deleteChat = (chatId: string, userId: string) =>
    apiClient.post(`${CHAT_BASE}/${chatId}/clear`, { userId }).then(res => res.data);

