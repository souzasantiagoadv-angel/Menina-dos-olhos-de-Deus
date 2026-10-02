import React, { useEffect, useState } from 'react';

// Searches YouTube live for videos matching a query and plays them inline.
export default function RelatedVideos({ query, count = 4, title = '🎬 Vídeos relacionados' }) {
  const [videos, setVideos] = useState(null);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    let alive = true;
    setVideos(null);
    fetch(`/api/videos/related?q=${encodeURIComponent(query)}&count=${count}`)
      .then((r) => r.json())
      .then((rows) => { if (alive) setVideos(rows); })
      .catch(() => { if (alive) setVideos([]); });
    return () => { alive = false; };
  }, [query, count]);

  if (videos === null) return <p className="muted">🔍 Buscando vídeos...</p>;
  if (videos.length === 0) return null;

  return (
    <div style={{ marginTop: 18 }}>
      <h2>{title}</h2>
      {playing && (
        <div className="video-frame" style={{ marginBottom: 12 }}>
          <iframe
            key={playing.videoId}
            src={`https://www.youtube.com/embed/${playing.videoId}`}
            title={playing.title}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="chip-row">
        {videos.map((v) => (
          <button key={v.videoId} className="chip" onClick={() => setPlaying(v)}>
            ▶️ {v.title.length > 38 ? v.title.slice(0, 38) + '…' : v.title}
          </button>
        ))}
      </div>
      {playing && <button className="btn ghost" onClick={() => setPlaying(null)}>✖ Fechar vídeo</button>}
    </div>
  );
}
