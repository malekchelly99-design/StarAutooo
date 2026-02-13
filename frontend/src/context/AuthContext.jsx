'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
          
          const res = await authAPI.me();
          setUser(res.user);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login(email, password);
      const { token, user: userData } = res;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Échec de la connexion';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (username, email, password, telephone) => {
    try {
      setError(null);
      const res = await authAPI.register({
        username,
        email,
        password,
        password_confirm: password,
        telephone,
      });
      const { token, user: userData } = res;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Échec de l'inscription";
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isClient = user?.role === 'CLIENT';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    isClient,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
