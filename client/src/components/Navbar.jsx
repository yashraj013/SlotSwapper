import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) return null;
  return (
    <nav className="nav">
      <div className="nav-brand">SlotSwapper</div>
      <div className="nav-links">
        <Link className={loc.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
        <Link className={loc.pathname === '/marketplace' ? 'active' : ''} to="/marketplace">Marketplace</Link>
        <Link className={loc.pathname === '/requests' ? 'active' : ''} to="/requests">Requests</Link>
      </div>
      <button className="btn" onClick={logout}>Logout</button>
    </nav>
  );
}
