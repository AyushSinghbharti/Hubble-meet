import { useEffect } from 'react';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  createChat,
  getChatById,
  getUserChats,
  addUserToChat,
  removeUserFromChat,
  sendMessage,
  getChatMessages,
  deleteMessage,
} from '../api/chat';
import {
  AddUserToChatRequest,
  CreateChatRequest,
  DeleteMessageRequest,
  RemoveUserFromChatRequest,
  SendMessageRequest,
  Chat,
  ChatMessage,
} from '../interfaces/chatInterface';
import {
  saveChatToStorage
} from '../store/localStorage';
import { useChatStore } from '../store/chatStore';



/* ---------- Create Chat ---------- */
export const useCreateChat = () => {
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  return useMutation({
    mutationFn: (data: CreateChatRequest) => createChat(data),
    onSuccess: async (data: Chat) => {
      setCurrentChat(data);
    },
    onError: (error) => { console.log(error) }
  });
};

/* ---------- Get single chat by ID ---------- */
export const useChatById = (chatId: string): UseQueryResult<Chat, Error> => {
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const queryResult = useQuery<Chat, Error, Chat, [string, string]>({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  console.log(queryResult);

  useEffect(() => {
    if (queryResult.data) {
      setCurrentChat(queryResult.data);
    }
    if (queryResult.error) {
      console.error("Error fetching chat by ID:", queryResult.error);
    }
  }, [queryResult.data, queryResult.error]);

  return queryResult;
};


/* ---------- Get all chats for a user ---------- */
export const useUserChats = (userId: string): UseQueryResult<Chat[], Error> => {
  const setChat = useChatStore((state) => state.setChat);

  const queryResult = useQuery<Chat[], Error, Chat[], [string, string]>({
    queryKey: ['chats', userId],
    queryFn: () => getUserChats(userId) as Promise<Chat[]>,
    enabled: !!userId,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (queryResult.data) {
      console.log(queryResult.data);
      saveChatToStorage(queryResult.data);
      setChat(queryResult.data);
    }
    if (queryResult.error) {
      console.error("Error fetching user chats:", queryResult.error);
    }
  }, [queryResult.data, queryResult.error]);

  return queryResult;
};

/* ---------- Add user to chat ---------- */
export const useAddUserToChat = () => {
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  return useMutation({
    mutationFn: ({ chatId, userId }: AddUserToChatRequest) => addUserToChat(chatId, userId),
    onSuccess: async (data: Chat) => {
      setCurrentChat(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

/* ---------- Remove user from chat ---------- */
export const useRemoveUserFromChat = () => {
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  return useMutation({
    mutationFn: ({ chatId, userId }: RemoveUserFromChatRequest) => removeUserFromChat(chatId, userId),
    onSuccess: async (data: Chat) => {
      setCurrentChat(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};


/* ---------- Send Message ---------- */
export const useSendMessage = () => {
  const addMessage = useChatStore((state) => state.addMessage);

  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendMessage(data),
    onSuccess: async (data: ChatMessage) => {
      addMessage(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

/* ---------- Get chat messages ---------- */
export const useChatMessages = (chatId: string): UseQueryResult<Chat, Error> => {
  const setMessages = useChatStore((state) => state.setMessages);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const queryResult = useQuery<ChatMessage[], Error, Chat, [string, string]>({
    queryKey: ['messages', chatId],
    queryFn: () => getChatMessages(chatId),
    enabled: !!chatId,
    refetchInterval: 10,
  });

  useEffect(() => {
    if (queryResult.data) {
      setMessages(queryResult.data.messages);
      setCurrentChat(queryResult.data);
    }
    if (queryResult.error) {
      console.error("Error fetching chat messages:", queryResult.error);
    }
  }, [queryResult.data, queryResult.error]);

  return queryResult;
};

/* ---------- Delete a message ---------- */
export const useDeleteMessage = () => {
  const deleteMessageFromStore = useChatStore((state) => state.deleteMessage);

  return useMutation({
    mutationFn: ({ messageId }: DeleteMessageRequest) => deleteMessage(messageId),
    onSuccess: (data, variable) => {
      deleteMessageFromStore(variable.messageId);
    },
  });
};