import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService, TokenManager, handleApiError } from '../../services/apiService';
import type { User, RegisterData } from '../../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = TokenManager.getUser();
        if (currentUser && AuthService.isAuthenticated()) {
          // Verify the token is still valid by fetching fresh user data
          const freshUser = await AuthService.getProfile();
          setUser(freshUser);
        }
      } catch (error) {
        // Token might be expired, clear it
        TokenManager.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ email, password });
      
      // Verify the user is an admin
      if (response.data.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(userData);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.changePassword(oldPassword, newPassword);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user && AuthService.isAuthenticated();
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    adminLogin,
    register,
    logout,
    updateUser,
    changePassword,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
