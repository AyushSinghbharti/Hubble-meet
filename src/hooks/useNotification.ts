// src/hooks/useNotification.ts
import { useQuery } from "@tanstack/react-query";
import { getNotificationHistory } from "../api/appNotification";
import { useNotificationStore } from "../store/notificationStore";

export const useNotificationHistory = ({
  userId,
  page = 1,
  size = 10,
}: {
  userId: string;
  page?: number;
  size?: number;
}) => {
  const { history, setHistory } = useNotificationStore.getState();

  return useQuery({
    queryKey: ["notificationHistory", userId, page, size],
    queryFn: async () => {
      const res = await getNotificationHistory({ userId, page, size });

      const isFirstPage = page === 1;
      const updated = isFirstPage
        ? res.notifications
        : [...history, ...res.notifications];

      // Push to store
      useNotificationStore.setState({
        history: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
        hasUnread: updated.some((n) => !n.isRead),
      });

      return res;
    },
    enabled: !!userId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};
