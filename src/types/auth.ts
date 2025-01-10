export interface User {
  id?: string;
  fullName: string;
  email: string;
  location: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}