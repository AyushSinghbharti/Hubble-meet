// src/api/notification.ts
import axios from "./axios"; // assuming you’ve centralized axios config
import { NotificationHistoryResponse } from "../interfaces/notificationInterface";

export const getNotificationHistory = async ({
  userId,
  page = 1,
  size = 10,
}: {
  userId: string;
  page?: number;
  size?: number;
}): Promise<NotificationHistoryResponse> => {
  const res = await axios.post("/api/notification/push/history", {
    userId,
    page,
    size,
  });
  return res.data;
};
