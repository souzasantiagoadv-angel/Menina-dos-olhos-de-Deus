import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const TESTAMENTS = [
  { key: 'todos', label: '🧺 Todos' },
  { key: 'velho', label: '📜 Velho Testamento' },
  { key: 'novo', label: '✝️ Novo Testamento' },
];

export function TestamentTabs({ value, onChange }) {
  return (
    <div className="tabs">
      {TESTAMENTS.map((t) => (
        <button
          key={t.key}
          className={`tab ${value === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function Stories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [testament, setTestament] = useState('todos');
  const [category, setCategory] = useState('todas');
  const [stories, setStories] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (testament !== 'todos') params.set('testament', testament);
    if (category !== 'todas') params.set('category', category);
    if (q) params.set('q', q);
    fetch(`/api/stories?${params.toString()}`)
      .then((r) => r.json())
      .then(setStories)
      .catch(() => setStories([]));
  }, [testament, category, q]);

  const randomStory = async () => {
    const params = new URLSearchParams();
    if (testament !== 'todos') params.set('testament', testament);
    const s = await (await fetch(`/api/stories/random?${params.toString()}`)).json();
    if (s) navigate(`/historias/${s.id}`);
  };

  return (
    <div>
      <h1>📖 Histórias Bíblicas</h1>
      <TestamentTabs value={testament} onChange={(k) => { setTestament(k); setCategory('todas'); }} />

      <div className="chip-row">
        <button className="chip random-chip" onClick={randomStory}>🎲 Aleatório</button>
        {['todas', 'Criação', 'Milagres', 'Parábolas', 'Coragem', 'Fé', 'Obediência', 'Perdão', 'Amizade', 'Natal', 'Páscoa'].map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c === 'todas' ? 'Todas as categorias' : c}
          </button>
        ))}
      </div>

      {q && (
        <p>
          Resultados para <strong>“{q}”</strong> —{' '}
          <Link to="/historias" className="back-link">limpar busca</Link>
        </p>
      )}

      {stories === null ? (
        <p className="muted">Carregando...</p>
      ) : stories.length === 0 ? (
        <p className="muted">Nenhuma história encontrada. 🐝 Tente outra busca!</p>
      ) : (
        <div className="cards-grid">
          {stories.map((s) => (
            <Link className="card" to={`/historias/${s.id}`} key={s.id}>
              <div className="big-emoji">{s.emoji}</div>
              <h3>{s.title}</h3>
              <div className="muted">{s.testament === 'velho' ? '📜 Velho' : '✝️ Novo'} · {s.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
