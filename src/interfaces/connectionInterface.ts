import { UserProfile } from "./profileInterface";
export type ConnectionStatus = 'CONNECTED' | 'PENDING' | 'BLOCKED';

// ---------- Request Interfaces ----------
export interface SendConnectionRequestBody {
  user_id: string;
  receiver_id: string;
}

export interface RejectConnectionRequestBody {
  user_id: string;
  receiver_id: string;
}

export interface RemoveRequestBody {
  user_id: string;
  receiver_id: string;
}

export interface AcceptConnectionRequestBody {
  user_id: string;
  sender_id: string;
}

export interface CloseConnectionRequestBody {
  user_id: string;
  closed_user_id: string;
}

export interface BlockUserRequestBody {
  user_id: string;
  blocked_user_id: string;
}

export interface UnblockUserRequestBody {
  user_id: string;
  blocked_user_id: string;
}

export interface GetUserConnectionsRequestBody {
  userId: string;
}

// ---------- Response Interfaces ----------
export interface DefaultSuccessResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface ConnectionUser extends UserProfile {
  connection_status: ConnectionStatus;
}

export interface Recommendations {
  recommendations: string[],
  hasMore: boolean
}

export interface ConnectionRequest {
  user_id: string;
  full_name: string;
  bio: string;
  job_title: string;
  industries_of_interest: string[];
  cities_on_radar: string[];
  profile_picture_url: string;
  request_status: "SENT" | "RECEIVED" | "ACCEPTED" | "REJECTED";
}

export interface SearchInterface {
  searchText: string,
  currentPage: number | string,
  PageSize: number | string
}