export interface NotificationItem {
  id: string;
  userId: number;
  title: string;
  message: string;
  type: string;
  actionUrl?: string | null;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsArgs {
  page?: number;
  limit?: number;
}

export interface NotificationsPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: NotificationsPagination;
  data: NotificationItem[];
}
