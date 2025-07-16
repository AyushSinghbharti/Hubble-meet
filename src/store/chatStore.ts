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

  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;

  // ✅ NEW STATE for pre-navigation tracking
  chatStatus: 'ready' | 'new' | null;
  setChatStatus: (status: 'ready' | 'new' | null) => void;

  intendedUserId: string | null;
  setIntendedUserId: (id: string | null) => void;
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

  isChatOpen: false,
  setIsChatOpen: (val) => set({ isChatOpen: val }),

  // ✅ NEW
  chatStatus: null,
  setChatStatus: (status) => set({ chatStatus: status }),

  intendedUserId: null,
  setIntendedUserId: (id) => set({ intendedUserId: id }),
}));