import { UserProfile } from "./profileInterface";
import { VbcCard } from "./vbcInterface";
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

export interface GetVbcConnectionsRequestBody {
  userId: string;
  searchText?: string;
  currentPage?: number;
  pageSize?: number;
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

export interface ConnectionVbc extends VbcCard {

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

export interface SearchUserResponse {
  success: boolean;
  message: string;
  pagination: {
    currentPage: string;
    itemsPerPage: number;
    totalUsersCount: number;
    totalPages: number;
    nextPage: string | null;
    previousPage: string | null;
  };
  data: SearchUserSummary[];
}

export interface SearchVBCResponse {
  success: boolean;
  message: string;
  pagination: {
    currentPage: string;
    itemsPerPage: number;
    totalUsersCount: number;
    totalPages: number;
    nextPage: string | null;
    previousPage: string | null;
  };
  data: VbcCard[];
}

export interface SearchUserSummary {
  user_id: string;
  full_name: string;
  created_at: string; // ISO date string
  is_active: boolean;
}