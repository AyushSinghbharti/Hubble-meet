import { create } from 'zustand';
import { Chat, ChatMessage } from '../interfaces/chatInterface';

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

  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;

  // ✅ NEW STATE for pre-navigation tracking
  chatStatus: 'ready' | 'new' | null;
  setChatStatus: (status: 'ready' | 'new' | null) => void;

  intendedUserId: string | null;
  setIntendedUserId: (id: string | null) => void;

  // ✅ NEW: Last viewed time per chat
  lastViewedMap: { [chatId: string]: string };
  setLastViewed: (chatId: string, timestamp: string) => void;

  // ⭐ Starred messages
  starredMessages: ChatMessage[];
  setStarredMessages: (messages: ChatMessage[]) => void;
  addStarredMessage: (message: ChatMessage) => void;
  removeStarredMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentChat: null,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  clearCurrentChat: () => set({ currentChat: null }),

  chat: null,
  setChat: (chat: Chat[]) => set({ chat: chat }),
  clearChat: () => set({ chat: null }),

  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  deleteMessage: (msgId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== msgId),
    })),
  clearMessages: () => set({ messages: [] }),

  isChatOpen: false,
  setIsChatOpen: (val) => set({ isChatOpen: val }),

  // ✅ NEW
  chatStatus: null,
  setChatStatus: (status) => set({ chatStatus: status }),

  intendedUserId: null,
  setIntendedUserId: (id) => set({ intendedUserId: id }),

  lastViewedMap: {},
  setLastViewed: (chatId, timestamp) =>
    set((state) => ({
      lastViewedMap: {
        ...state.lastViewedMap,
        [chatId]: timestamp,
      },
    })),

  starredMessages: [],
  setStarredMessages: (messages) => set({ starredMessages: messages }),
  addStarredMessage: (message) =>
    set((state) => ({
      starredMessages: [...state.starredMessages, message],
    })),
  removeStarredMessage: (messageId) =>
    set((state) => ({
      starredMessages: state.starredMessages.filter((msg) => msg.id !== messageId),
    })),
}));