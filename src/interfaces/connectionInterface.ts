export interface CreateConnectionPayload {
  sender_id: string;
}

export interface RemoveConnectionPayload {
  receiver_id: string;
}

export interface RejectConnectionPayload {
  sender_id: string;
}

export interface CloseConnectionPayload {
  closed_user_id: string;
}

export interface RecommendedUser {
  id: string;
  name: string;
  interests: string[];
  mutualConnections?: number;
}
