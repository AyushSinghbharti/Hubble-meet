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

/**
 * Retrieves all messages in a chat
 */
export const getChatMessages = (
    chatId: string
): Promise<GetChatMessagesResponse> =>
    apiClient.get<GetChatMessagesResponse>(`${CHAT_BASE}/${chatId}`).then(res => res.data);

/**
 * Deletes a specific message by its ID
 */
export const deleteMessage = (
    messageId: string
): Promise<DeleteMessageResponse> =>
    apiClient.delete<DeleteMessageResponse>(`${CHAT_BASE}/${messageId}`).then(res => res.data);
