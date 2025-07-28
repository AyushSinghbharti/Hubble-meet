import { create } from 'zustand';
import { Chat, ChatMessage } from '../interfaces/chatInterface';
import { saveLastViewedMapToStorage } from "@/src/store/localStorage";

interface ChatStore {
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  clearCurrentChat: () => void;

  chat: Chat[] | null;
  setChat: (chat: Chat[]) => void;
  clearChat: () => void;

  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  addMessage: (msg: ChatMessage) => void;
  deleteMessage: (msgId: string) => void;
  clearMessages: () => void;

  hasMore: boolean;
  replaceMessages: (msgs: ChatMessage[]) => void;
  addMessages: (msgs: ChatMessage[]) => void;
  setHasMore: (val: boolean) => void;

  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;

  chatStatus: 'ready' | 'new' | null;
  setChatStatus: (status: 'ready' | 'new' | null) => void;

  intendedUserId: string | null;
  setIntendedUserId: (id: string | null) => void;

  lastViewedMap: { [chatId: string]: string };
  setLastViewed: (chatId: string, timestamp: string) => void;
  setAllLastViewed: (map: Record<string, string>) => void;

  starredMessages: ChatMessage[];
  setStarredMessages: (messages: ChatMessage[]) => void;
  addStarredMessage: (message: ChatMessage) => void;
  removeStarredMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Current chat
  currentChat: null,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  clearCurrentChat: () => set({ currentChat: null }),

  // All chats
  chat: null,
  setChat: (chat) => set({ chat }),
  clearChat: () => set({ chat: null }),

  // Messages
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [msg, ...state.messages] })),
  deleteMessage: (msgId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== msgId),
    })),
  clearMessages: () => set({ messages: [], hasMore: true }),

  // Pagination
  hasMore: true,
  replaceMessages: (msgs) => set({ messages: msgs }),
  addMessages: (msgs) =>
    set((state) => {
      const existingIds = new Set(state.messages.map((m) => m.id));
      const newMessages = msgs.filter((m) => !existingIds.has(m.id));
      return { messages: [...state.messages, ...newMessages] };
    }),
  setHasMore: (val) => set({ hasMore: val }),

  // UI
  isChatOpen: false,
  setIsChatOpen: (val) => set({ isChatOpen: val }),

  // Chat status (new, ready)
  chatStatus: null,
  setChatStatus: (status) => set({ chatStatus: status }),

  // Pre-navigation target
  intendedUserId: null,
  setIntendedUserId: (id) => set({ intendedUserId: id }),

  // Last viewed timestamps
  lastViewedMap: {},
  setLastViewed: (chatId, timestamp) =>
    set((state) => {
      const updatedMap = { ...state.lastViewedMap, [chatId]: timestamp };
      saveLastViewedMapToStorage(updatedMap);
      return { lastViewedMap: updatedMap };
    }),
  setAllLastViewed: (map) => set({ lastViewedMap: map }),

  // Starred messages
  starredMessages: [],
  setStarredMessages: (messages) => set({ starredMessages: messages }),
  addStarredMessage: (message) =>
    set((state) => ({
      starredMessages: [...state.starredMessages, message],
    })),
  removeStarredMessage: (messageId) =>
    set((state) => ({
      starredMessages: state.starredMessages.filter(
        (msg) => msg.id !== messageId
      ),
    })),
}));