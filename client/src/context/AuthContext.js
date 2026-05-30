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
    // Cek trusted device dulu
    const deviceId = localStorage.getItem('safevault_device_id');
    const savedEmail = localStorage.getItem('safevault_email');

    if (deviceId && savedEmail) {
      try {
        const res = await authService.verifyDevice(savedEmail, deviceId);
        if (res.data.trusted) {
          localStorage.setItem('safevault_token', res.data.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      } catch {
        // lanjut ke cek token biasa
      }
    }

    // Fallback ke token biasa
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

const login = useCallback(async (email, masterPassword, trustDevice = false) => {
  const res = await authService.login(email, masterPassword);

  localStorage.setItem('safevault_token', res.data.token);
  localStorage.setItem('safevault_email', res.data.user.email);
  setUser(res.data.user);
  setIsAuthenticated(true);

  if (trustDevice) {
    // Generate device ID kalau belum ada
    let deviceId = localStorage.getItem('safevault_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('safevault_device_id', deviceId);
    }
    // Simpan ke DB
    await authService.trustDevice(deviceId);
  }

  return res.data;
}, []);

  const register = useCallback(async (email, masterPassword) => {
    const res = await authService.register(email, masterPassword);
    localStorage.setItem('safevault_token', res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    const deviceId = localStorage.getItem('safevault_device_id');
    if (deviceId) {
      try {
        await authService.removeDevice(deviceId);
      } catch {
        // lanjut logout walau gagal
      }
    }
    localStorage.removeItem('safevault_token');
    localStorage.removeItem('safevault_email');
    localStorage.removeItem('safevault_device_id');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const verifyMasterPassword = useCallback(async (masterPassword) => {
    const res = await authService.verifyMasterPassword(masterPassword);
    return res.data.success;
  }, []);

  const updateSettings = useCallback(async (settings) => {
    const res = await authService.updateSettings(settings);
    setUser(res.data.user);
    return res.data.user;
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
      updateSettings,
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
