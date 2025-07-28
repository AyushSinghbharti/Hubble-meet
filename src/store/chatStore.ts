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
  setAllLastViewed: (map: Record<string, string>) => void;
  // ⭐ Starred messages
  starredMessages: ChatMessage[];
  setStarredMessages: (messages: ChatMessage[]) => void;
  addStarredMessage: (message: ChatMessage) => void;
  removeStarredMessage: (messageId: string) => void;
  // ⭐ NEW: Toggle message star (for both messages and starredMessages)
  toggleMessageStar: (messageId: string) => void;
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
  addMessage: (msg) => set((state) => ({ messages: [msg, ...state.messages] })),
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
  setLastViewed: (chatId, timestamp) => {
    set((state) => {
      const updatedMap = {
        ...state.lastViewedMap,
        [chatId]: timestamp,
      };
      saveLastViewedMapToStorage(updatedMap);
      return { lastViewedMap: updatedMap };
    });
  },
  setAllLastViewed: (map: Record<string, string>) => set({ lastViewedMap: map }),

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

  // ⭐ NEW: Toggle message star function
  toggleMessageStar: (messageId) =>
    set((state) => {
      // Find the message in the current messages
      const messageToToggle = state.messages.find((msg) => msg.id === messageId);

      if (!messageToToggle) return state;

      // Toggle starred status
      const updatedMessage = { ...messageToToggle, starred: !messageToToggle.starred };

      // Update messages array
      const updatedMessages = state.messages.map((msg) =>
        msg.id === messageId ? updatedMessage : msg
      );

      // Update starredMessages array
      let updatedStarredMessages;
      if (updatedMessage.starred) {
        // Add to starred messages if not already there
        const isAlreadyStarred = state.starredMessages.some((msg) => msg.id === messageId);
        updatedStarredMessages = isAlreadyStarred
          ? state.starredMessages.map((msg) => msg.id === messageId ? updatedMessage : msg)
          : [...state.starredMessages, updatedMessage];
      } else {
        // Remove from starred messages
        updatedStarredMessages = state.starredMessages.filter((msg) => msg.id !== messageId);
      }

      return {
        messages: updatedMessages,
        starredMessages: updatedStarredMessages,
      };
    }),
}));