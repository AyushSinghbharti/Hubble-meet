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
  sendMedia,
  deleteMessageforme,
  deleteMessageforeveryone,
  starMessage,
  unStarMessage,
  getStarredMessages
} from '../api/chat';
import {
  AddUserToChatRequest,
  CreateChatRequest,
  DeleteMessageRequest,
  RemoveUserFromChatRequest,
  SendMessageRequest,
  Chat,
  ChatMessage,
  SendMediaRequest,
} from '../interfaces/chatInterface';
import {
  saveChatToStorage
} from '../store/localStorage';
import { useChatStore } from '../store/chatStore';




/* ---------- Create Chat ---------- */
export const useCreateChat = () => {
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const setMessages = useChatStore((state) => state.setMessages);

  return useMutation({
    mutationFn: (data: CreateChatRequest) => createChat(data),
    onSuccess: async (data: Chat) => {
      setCurrentChat(data);
      setMessages(data.messages);
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

/* ---------- Send Media ---------- */
export const useSendMediaMessage = () => {
  const addMessage = useChatStore((state) => state.addMessage);

  return useMutation({
    mutationFn: (data: SendMediaRequest) => sendMedia(data),
    onSuccess: async (data: ChatMessage) => {
      addMessage(data);
    },
    onError: (error) => {
      console.log("Error sending media message:", error);
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
      // setMessages(queryResult.data.messages);
      setMessages(queryResult.data); //The interface is not updated for this
      // setCurrentChat(queryResult?.data[0]?.chat); //The interface is not updated for this
    }
    if (queryResult.error) {
      console.error("Error fetching chat messages:", queryResult.error);
    }
  }, [queryResult.data, queryResult.error]);

  return queryResult;
};

/* ---------- Delete a message ---------- */
export const useDeleteMessageForMe = () => {
  const deleteMessageFromStore = useChatStore((state) => state.deleteMessage);

  return useMutation({
    mutationFn: ({ messageId, userId }: DeleteMessageRequest) => deleteMessageforme(messageId, userId),
    onSuccess: (data, variable) => {
      deleteMessageFromStore(variable.messageId);
    },
  });
};``

export const useDeleteMessageForEveryone = () => {
  const deleteMessageFromStore = useChatStore((state) => state.deleteMessage);

  return useMutation({
    mutationFn: ({ messageId, userId }: DeleteMessageRequest) => deleteMessageforeveryone(messageId, userId),
    onSuccess: (data, variable) => {
      deleteMessageFromStore(variable.messageId);
    },
  });
};

/* ---------- Star a message ---------- */
export const useStarMessage = () => {
  return useMutation({
    mutationFn: ({ messageId, userId }: { messageId: string; userId: string }) =>
      starMessage(messageId, userId),
    onSuccess: (data) => {
      console.log("Message starred:", data);
    },
    onError: (err) => {
      console.log("Star error:", err);
    },
  });
};

/* ---------- Unstar a message ---------- */
export const useUnstarMessage = () => {
  return useMutation({
    mutationFn: ({ messageId, userId }: { messageId: string; userId: string }) =>
      unStarMessage(messageId, userId),
    onSuccess: (data) => {
      console.log("Message unstarred successfull");
    },
    onError: (err) => {
      console.log("Unstar error:", err);
    },
  });
};

/* ---------- Get Starred Messages ---------- */
export const useStarredMessages = (userId: string) => {
  const setStarredMessages = useChatStore((s) => s.setStarredMessages);

  const queryResult = useQuery<ChatMessage[]>({
    queryKey: ['starredMessages', userId],
    queryFn: () => getStarredMessages(userId),
    enabled: !!userId,
    refetchInterval: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.data) {
      setStarredMessages(queryResult.data);
    }
  }, [queryResult.data, setStarredMessages]);

  return queryResult;
};

import { clearChat, deleteChat } from '../api/chat'; // ✅ ensure import

/* ---------- Clear Chat ---------- */
export const useClearChat = () => {
  const setMessages = useChatStore((state) => state.setMessages);

  return useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      clearChat(chatId, userId),
    onSuccess: () => {
      setMessages([]);
    },
    onError: (err) => {
      console.error("Clear chat error:", err);
    },
  });
};

/* ---------- Delete Chat ---------- */
export const useDeleteChat = () => {
  const removeChat = useChatStore((state) => state.clearChat); // you should have this in store

  return useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      deleteChat(chatId, userId),
    onSuccess: (_, variables) => {
      removeChat(); // Remove chat from store
    },
    onError: (err) => {
      console.error("Delete chat error:", err);
    },
  });
};
