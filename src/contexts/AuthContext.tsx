import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/auth';

type StoreState = ReturnType<typeof useAuthStore.getState>;

interface AuthContextType {
  user: StoreState['user'];
  isAuthenticated: StoreState['isAuthenticated'];
  isLoading: StoreState['isLoading'];
  error: StoreState['error'];
  login: StoreState['login'];
  signup: StoreState['signup'];
  logout: StoreState['logout'];
  clearError: StoreState['clearError'];
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  } = useAuthStore();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isAdmin = hasRole('admin');
  const isUser = hasRole('user');
  const isGuest = hasRole('guest');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
        hasRole,
        isAdmin,
        isUser,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
