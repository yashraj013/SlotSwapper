import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post('/user/login', { email, password });
            // Backend sets httpOnly cookie. Mark client as authenticated locally.
            setToken(res?.data?.token || 'cookie');
            setUser(res?.data?.user || null);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err?.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload) => {
        setLoading(true);
        try {
            const res = await api.post('/user/register', payload);
            // Backend sets httpOnly cookie. Mark client as authenticated locally.
            setToken(res?.data?.token || 'cookie');
            setUser(res?.data?.user || null);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err?.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.get('/user/logout');
        } catch (_) {}
        setToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({ token, user, loading, login, register, logout, setUser }), [token, user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);


