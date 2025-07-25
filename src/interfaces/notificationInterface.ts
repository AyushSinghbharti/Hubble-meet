export type NotificationType = "INFO" | "ALERT" | "REMINDER"; // Add more if needed

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationHistoryResponse {
  notifications: NotificationItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
