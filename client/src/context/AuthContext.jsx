import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token;

  const saveSession = (token, user) => {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const register = async (payload) => {
    const { data } = await api.post('/user/register', payload);
    saveSession(data.token, data.user);
    navigate('/dashboard');
  };

  const login = async (payload) => {
    const { data } = await api.post('/user/login', payload);
    saveSession(data.token, data.user);
    navigate('/dashboard');
  };

  const logout = async () => {
    try { await api.get('/user/logout'); } catch {}
    clearSession();
    navigate('/login');
  };

  const value = useMemo(() => ({ token, user, isAuthenticated, register, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
