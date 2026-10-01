import React from 'react';
import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div>
      <h1>🎮 Jogos Bíblicos</h1>
      <div className="cards-grid">
        <Link className="card" to="/jogos/memoria">
          <div className="big-emoji">🃏</div>
          <h3>Memória das Histórias</h3>
          <div className="muted">Encontre os pares dos personagens da Bíblia!</div>
        </Link>
        <Link className="card" to="/jogos/quiz">
          <div className="big-emoji">⚡</div>
          <h3>Quiz Relâmpago</h3>
          <div className="muted">10 perguntas — responde rápido!</div>
        </Link>
      </div>
    </div>
  );
}
