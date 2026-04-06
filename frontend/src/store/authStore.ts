import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, ApiError } from '../services/api';
import type {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from '../types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const data = await api.post<AuthResponse>('/api/auth/login', credentials);

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.username}`,
            createdAt: new Date(data.user.createdAt),
            lastLogin: new Date(),
            preferences: data.user.preferences || {
              theme: 'dark',
              language: 'en',
              explicitContent: false,
              autoplay: true,
              volume: 0.8,
            },
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          return true;
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const data = await api.post<AuthResponse>('/api/auth/signup', credentials);

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.username}`,
            createdAt: new Date(data.user.createdAt),
            preferences: data.user.preferences || {
              theme: 'dark',
              language: 'en',
              explicitContent: false,
              autoplay: false,
              volume: 0.5,
            },
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          return true;
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Signup failed. Please try again.';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        const { accessToken, refreshToken } = get();
        // Fire and forget logout request
        if (accessToken && refreshToken) {
          api.post('/api/auth/logout', { refreshToken }).catch(() => {});
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      updateUserPreferences: preferences => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                ...preferences,
              },
            },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'musify-auth',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
