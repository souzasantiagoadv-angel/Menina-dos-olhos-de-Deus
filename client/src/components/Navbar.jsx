import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../App.jsx';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🐝 Abelhinhas</Link>
      <NavLink to="/historias" className="navlink">📖 Histórias</NavLink>
      <NavLink to="/videos" className="navlink">🎬 Vídeos</NavLink>
      <NavLink to="/jogos" className="navlink">🎮 Jogos</NavLink>
      <NavLink to="/testes" className="navlink">🧠 Testes</NavLink>
      <span className="spacer" />
      {user ? (
        <>
          <Link to="/perfil" className="user-chip">
            <span>{user.avatar}</span><span>{user.name}</span>
          </Link>
          <button className="btn ghost" onClick={logout}>Sair</button>
        </>
      ) : (
        <Link to="/entrar" className="btn">Entrar</Link>
      )}
    </nav>
  );
}
