export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  email: string;
  phone: string;
  currentCompany: string;
  jobTitle: string;
  city: string;
  currentIndustry: string[];
  industriesOfInterest: string[];
  citiesOnRadar: string[];
  connectionPreferences: string[];
  profilePictureUrl: string;
  allowVbcSharing: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserProfilePayload {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  email: string;
  phone: string;
  currentCompany: string;
  jobTitle: string;
  city: string;
  currentIndustry: string[];
  industriesOfInterest: string[];
  citiesOnRadar: string[];
  connectionPreferences: string[];
  profilePictureUrl: string;
  allowVbcSharing: boolean;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  jobTitle?: string;
  bio?: string;
  city?: string;
  currentIndustry?: string[];
  industriesOfInterest?: string[];
  connectionPreferences?: string[];
  allowVbcSharing?: boolean;
}
