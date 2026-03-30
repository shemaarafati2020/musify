import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/auth';

interface AuthContextType {
  user: useAuthStore['user'];
  isAuthenticated: useAuthStore['isAuthenticated'];
  isLoading: useAuthStore['isLoading'];
  login: useAuthStore['login'];
  signup: useAuthStore['signup'];
  logout: useAuthStore['logout'];
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
    login,
    signup,
    logout,
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
        login,
        signup,
        logout,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
