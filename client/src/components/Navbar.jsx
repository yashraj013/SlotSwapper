import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel)' }}>
            <div className="container row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 16 }}>
                    <strong>SlotSwapper</strong>
                    {token && (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/marketplace">Marketplace</Link>
                            <Link to="/requests">Requests</Link>
                        </>
                    )}
                </div>
                <div className="row" style={{ gap: 12 }}>
                    {!token ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <button className="btn secondary" onClick={onLogout}>Logout</button>
                    )}
                </div>
            </div>
        </div>
    );
}


