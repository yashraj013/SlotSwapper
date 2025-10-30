import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.ok) navigate('/dashboard');
        else setError(res.message);
    };

    return (
        <div className="container" style={{ maxWidth: 420 }}>
            <div className="card">
                <h2>Login</h2>
                <form onSubmit={onSubmit} className="row" style={{ flexDirection: 'column', gap: 12 }}>
                    <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <div style={{ color: 'tomato' }}>{error}</div>}
                    <button className="btn" disabled={loading} type="submit">{loading ? 'Loading...' : 'Login'}</button>
                </form>
                <div style={{ marginTop: 12 }}>
                    No account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}



