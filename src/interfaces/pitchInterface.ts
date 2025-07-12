export type PitchStatus = 'pending' | 'approved' | 'rejected';

export interface Pitch {
  id: string;
  user_id: string;
  status: PitchStatus;
  url: string;
  // display_name: string;
  // caption: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePitchPayload {
  user_id: string;
  video: any;
}

export interface UpdatePitchPayload {
  status: PitchStatus;
}

export interface ReactToPitchPayload {
  userId: string;
}

export interface getUserById {
  userId: string;
}

export interface PitchWithLikeStatus {
  pitch: string;
  has_liked: boolean;
}