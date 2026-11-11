export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
