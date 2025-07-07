export type PitchStatus = 'open' | 'approved' | 'closed';

export interface Pitch {
  id: string;
  userId: string; // Add this for user-based filtering
  title: string;
  description: string;
  status: PitchStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePitchPayload {
  title: string;
  description: string;
}

export interface UpdatePitchPayload {
  title?: string;
  description?: string;
  status?: PitchStatus;
}
