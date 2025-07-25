import { create } from "zustand";
import { NotificationItem } from "../interfaces/notificationInterface";

interface NotificationStore {
  history: NotificationItem[];
  unreadCount: number;
  hasUnread: boolean;

  setHistory: (data: NotificationItem[]) => void;
  clearHistory: () => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  history: [],
  unreadCount: 0,
  hasUnread: false,

  setHistory: (data) => {
    const unread = data.filter((n) => !n.isRead);
    set({
      history: data,
      unreadCount: unread.length,
      hasUnread: unread.length > 0,
    });
  },

  clearHistory: () => set({ history: [], unreadCount: 0, hasUnread: false }),

  markAllAsRead: () =>
    set((state) => ({
      history: state.history.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
      hasUnread: false,
    })),
}));
