import React, { useEffect, useState } from 'react';
import { TestamentTabs } from './Stories.jsx';

export default function Videos() {
  const [testament, setTestament] = useState('todos');
  const [videos, setVideos] = useState(null);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (testament !== 'todos') params.set('testament', testament);
    fetch(`/api/videos?${params.toString()}`)
      .then((r) => r.json())
      .then((rows) => { setVideos(rows); setPlaying(null); })
      .catch(() => setVideos([]));
  }, [testament]);

  return (
    <div>
      <h1>🎬 Assistir Vídeos</h1>
      <TestamentTabs value={testament} onChange={setTestament} />

      {playing && (
        <div style={{ marginBottom: 20 }}>
          <div className="video-frame">
            <iframe
              key={playing.id}
              src={`https://www.youtube.com/embed/${playing.youtube_id}`}
              title={playing.title}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h2>{playing.title}</h2>
          <button className="btn ghost" onClick={() => setPlaying(null)}>✖ Fechar</button>
        </div>
      )}

      {videos === null ? (
        <p className="muted">Carregando...</p>
      ) : (
        <div className="cards-grid">
          {videos.map((v) => (
            <button
              className="card"
              key={v.id}
              style={{ border: 'none', cursor: 'pointer', textAlign: 'left' }}
              onClick={() => { setPlaying(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="big-emoji">▶️</div>
              <h3>{v.title}</h3>
              <div className="muted">{v.testament === 'velho' ? '📜 Velho' : '✝️ Novo'} · {v.category}</div>
            </button>
          ))}
          {videos.length === 0 && <p className="muted">Nenhum vídeo por aqui ainda.</p>}
        </div>
      )}
    </div>
  );
}
