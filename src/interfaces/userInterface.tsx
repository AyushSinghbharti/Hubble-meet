export default interface UserInterface {
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
