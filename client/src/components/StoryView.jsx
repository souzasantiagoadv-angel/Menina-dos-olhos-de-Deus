import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function StoryView() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/stories/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setStory)
      .catch(() => setError('História não encontrada'));
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!story) return <p className="muted">Carregando...</p>;

  return (
    <div>
      <Link to="/historias" className="back-link">← Voltar para histórias</Link>
      <div className="story-reader">
        <div className="story-emoji">{story.emoji}</div>
        <h1>{story.title}</h1>
        <p>
          <span className="badge">{story.testament === 'velho' ? '📜 Velho Testamento' : '✝️ Novo Testamento'}</span>
          <span className="badge">🏷️ {story.category}</span>
        </p>
        <p style={{ fontSize: 19 }}>{story.text}</p>
      </div>
    </div>
  );
}
