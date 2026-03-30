import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  MockUser,
} from '../types/auth';

// Mock database of users
const MOCK_USERS: MockUser[] = [
  {
    id: 'admin-1',
    email: 'admin@musify.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-01'),
    preferences: {
      theme: 'dark',
      language: 'en',
      explicitContent: true,
      autoplay: true,
      volume: 0.8,
    },
  },
  {
    id: 'user-1',
    email: 'user@musify.com',
    username: 'musiclover',
    password: 'user123',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(),
    preferences: {
      theme: 'dark',
      language: 'en',
      explicitContent: false,
      autoplay: false,
      volume: 0.6,
    },
  },
  {
    id: 'guest-1',
    email: 'guest@musify.com',
    username: 'guest',
    password: 'guest',
    role: 'guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    createdAt: new Date(),
    preferences: {
      theme: 'dark',
      language: 'en',
      explicitContent: false,
      autoplay: false,
      volume: 0.5,
    },
  },
];

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

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockUser = MOCK_USERS.find(
            u =>
              u.email === credentials.email &&
              u.password === credentials.password
          );

          if (mockUser) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = mockUser;
            set({
              user: {
                ...userWithoutPassword,
                lastLogin: new Date(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: 'Invalid email or password',
              isLoading: false,
            });
            return false;
          }
        } catch {
          set({
            error: 'Login failed. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if user already exists
          const existingUser = MOCK_USERS.find(
            u => u.email === credentials.email
          );
          if (existingUser) {
            set({
              error: 'User with this email already exists',
              isLoading: false,
            });
            return false;
          }

          // Create new user
          const newUser: MockUser = {
            id: `user-${Date.now()}`,
            email: credentials.email,
            username: credentials.username,
            password: credentials.password,
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
            createdAt: new Date(),
            preferences: {
              theme: 'dark',
              language: 'en',
              explicitContent: false,
              autoplay: false,
              volume: 0.5,
            },
          };

          // In a real app, this would be saved to a database
          MOCK_USERS.push(newUser);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = newUser;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch {
          set({
            error: 'Signup failed. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
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
      }),
    }
  )
);
