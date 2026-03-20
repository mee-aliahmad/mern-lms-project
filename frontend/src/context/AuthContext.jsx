import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides authentication state + methods.
 * Persists user data (including JWT) in localStorage.
 * Validates token on app load via /api/auth/me.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Returns the dashboard path for a given role
   */
  const getDashboardPath = useCallback((role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  }, []);

  /**
   * Validate token on app load — ensures session persists across refreshes
   * and auto-logs out if token is invalid/expired.
   */
  useEffect(() => {
    const validateSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verify token is still valid by calling /auth/me
          const { data } = await API.get('/auth/me');
          // Keep the token from localStorage but update user info from server
          setUser({ ...data.data, token: parsed.token });
        } catch {
          // Token is invalid or expired — clear session
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateSession();
  }, []);

  /**
   * Register a new user
   */
  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    const loggedInUser = data.data;
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  /**
   * Login an existing user
   */
  const login = async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    const loggedInUser = data.data;
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  /**
   * Update user profile (name and/or password)
   */
  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    const updatedUser = data.data;
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  /**
   * Logout — clear all auth state and localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    getDashboardPath,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for consuming auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
