export type PitchStatus = 'open' | 'approved' | 'closed';

export interface PitchResponse {
  success: boolean;
  message: string;
  data: Pitch;
}


export interface Pitch {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'complete';
  url: string;
  display_name: string;
  pitch_caption?: string;
  created_at: string;
  updated_at: string;
}

export interface PitchFormData {
  video: {
    uri: string;
    name?: string;
    type?: string;
  };
  user_id: string;
  display_name: string;
  pitch_caption: string;
}