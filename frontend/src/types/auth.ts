export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  explicitContent: boolean;
  autoplay: boolean;
  volume: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  username: string;
  password: string;
}

export interface MockUser {
  id: string;
  email: string;
  username: string;
  password: string; // In real app, this would be hashed
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  preferences: UserPreferences;
}
