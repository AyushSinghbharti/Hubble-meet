export interface UserProfile {
  user_id: string;
  full_name: string;
  date_of_birth: string; // ISO string format
  gender: string;
  bio: string;
  email: string;
  phone: string;
  current_company?: string;
  job_title?: string;
  city?: string;
  current_industry?: string[];
  industries_of_interest?: string[];
  cities_on_radar?: string[];
  connection_preferences?: string[];
  profile_picture_url?: string;
  allow_vbc_sharing?: boolean;
  is_active: boolean;
  created_at: string; // ISO string
  updated_at?: string;
}

export interface CreateUserProfilePayload {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  email: string;
  phone: string;
  currentCompany?: string;
  jobTitle?: string;
  city?: string;
  currentIndustry?: string[];
  industriesOfInterest?: string[];
  citiesOnRadar?: string[];
  connectionPreferences?: string[];
  profilePictureUrl?: string;
  allowVbcSharing?: boolean;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  bio?: string;
  currentCompany?: string;
  jobTitle?: string;
  city?: string;
  currentIndustry?: string[];
  industriesOfInterest?: string[];
  citiesOnRadar?: string[];
  connectionPreferences?: string[];
  profilePictureUrl?: string;
  allowVbcSharing?: boolean;
}