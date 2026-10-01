import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App.jsx';

export default function Auth() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', age: 8 });
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) { setUser(data); navigate('/'); }
    else setError(data.error || 'Ops, tente de novo');
  };

  const OAUTH = [
    { label: 'Google', icon: '🔵' }, { label: 'Apple', icon: '' },
    { label: 'Microsoft', icon: '🟦' }, { label: 'Facebook', icon: '📘' },
    { label: 'Instagram', icon: '📸' }, { label: 'X', icon: '✖️' },
  ];

  return (
    <div className="form-card">
      <div className="tabs">
        <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(null); }}>Entrar</button>
        <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(null); }}>Criar conta</button>
      </div>
      <form onSubmit={submit}>
        {mode === 'signup' && (
          <>
            <label>Seu nome</label>
            <input value={form.name} onChange={set('name')} placeholder="Como você se chama?" />
            <label>Sua idade</label>
            <input type="number" min="6" max="12" value={form.age} onChange={set('age')} />
          </>
        )}
        <label>E-mail</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="voce@email.com" />
        <label>Senha</label>
        <input type="password" value={form.password} onChange={set('password')} placeholder="••••" />
        {error && <p className="error-text">{error}</p>}
        <button className="btn green" style={{ width: '100%' }} type="submit">
          {mode === 'login' ? 'Entrar 🐝' : 'Criar conta 🐝'}
        </button>
      </form>
      <p className="muted" style={{ textAlign: 'center' }}>ou entre com:</p>
      <div className="oauth-row">
        {OAUTH.map((o) => (
          <button key={o.label} type="button" className="oauth-btn" title="Em breve!">
            {o.icon} {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
