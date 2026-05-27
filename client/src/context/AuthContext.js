import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider - Open/Closed Principle: extend auth behavior without modifying core
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('safevault_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('safevault_token');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, masterPassword) => {
    const res = await authService.login(email, masterPassword);
    localStorage.setItem('safevault_token', res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  }, []);

  const register = useCallback(async (email, masterPassword) => {
    const res = await authService.register(email, masterPassword);
    localStorage.setItem('safevault_token', res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('safevault_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const verifyMasterPassword = useCallback(async (masterPassword) => {
    const res = await authService.verifyMasterPassword(masterPassword);
    return res.data.success;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      verifyMasterPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
