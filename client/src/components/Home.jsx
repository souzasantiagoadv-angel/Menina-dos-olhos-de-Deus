import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../App.jsx';

export default function Home() {
  const { user } = useUser();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/historias?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div>
      <div className="hero">
        <div style={{ fontSize: 60 }}>🐝</div>
        <h1>Bem-vindo às Abelhinhas!</h1>
        <p>Histórias, vídeos, jogos e testes da Bíblia para você zumbir de alegria!</p>
        <form className="search-bar" onSubmit={search}>
          <input
            placeholder="🔍 Buscar histórias bíblicas..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </div>

      <div className="cards-grid">
        <Link className="card" to="/historias">
          <div className="big-emoji">📖</div>
          <h3>Histórias Bíblicas</h3>
          <div className="muted">Do Velho e do Novo Testamento, por categoria</div>
        </Link>
        <Link className="card" to="/videos">
          <div className="big-emoji">🎬</div>
          <h3>Assistir Vídeos</h3>
          <div className="muted">Episódios divertidos para aprender</div>
        </Link>
        <Link className="card" to="/jogos">
          <div className="big-emoji">🎮</div>
          <h3>Jogos Bíblicos</h3>
          <div className="muted">Memória e quiz-relâmpago</div>
        </Link>
        <Link className="card" to="/testes">
          <div className="big-emoji">🧠</div>
          <h3>Testes de Conhecimento</h3>
          <div className="muted">Quanto você lembra das histórias?</div>
        </Link>
      </div>

      {!user && (
        <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
          <h3>Crie sua conta para salvar preferências, pontuações e perfil! 🍯</h3>
          <Link className="btn green" to="/entrar">Entrar ou criar conta</Link>
        </div>
      )}
    </div>
  );
}
