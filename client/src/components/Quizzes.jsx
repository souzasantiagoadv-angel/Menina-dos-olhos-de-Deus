import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../App.jsx';
import { TestamentTabs } from './Stories.jsx';
import RelatedVideos from './RelatedVideos.jsx';

export default function Quizzes() {
  const { user } = useUser();
  const [testament, setTestament] = useState('todos');
  const [quizzes, setQuizzes] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (testament !== 'todos') params.set('testament', testament);
    fetch(`/api/quizzes?${params.toString()}`)
      .then((r) => r.json())
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, [testament]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/my-results').then((r) => (r.ok ? r.json() : [])).then(setResults).catch(() => {});
  }, [user]);

  const bestFor = (id) => {
    const mine = results.filter((r) => r.quiz_id === id);
    return mine.length ? `${Math.max(...mine.map((r) => r.score))}/${mine[0].total}` : null;
  };

  return (
    <div>
      <h1>🧠 Testes de Conhecimento</h1>
      <TestamentTabs value={testament} onChange={setTestament} />
      {quizzes === null ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="cards-grid">
          {quizzes.map((qz) => (
            <Link className="card" to={`/testes/${qz.id}`} key={qz.id}>
              <div className="big-emoji">{qz.emoji}</div>
              <h3>{qz.title}</h3>
              <div className="muted">
                {qz.total} perguntas · {qz.testament === 'velho' ? '📜 Velho' : '✝️ Novo'}
                {user && bestFor(qz.id) && <> · ⭐ Melhor: {bestFor(qz.id)}</>}
              </div>
            </Link>
          ))}
        </div>
      )}
      {!user && <p className="muted">Entre na sua conta para salvar suas pontuações! 🍯</p>}
      <RelatedVideos query="perguntas e respostas bíblicas para crianças" title="🎬 Vídeos para aprender mais" />
    </div>
  );
}
