import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EMOJIS = ['🐝', '🚢', '🦁', '🐟', '🌈', '👑', '⭐', '🪨'];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);      // indexes currently flipped
  const [done, setDone] = useState([]);      // matched emoji values
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setCards(shuffle([...EMOJIS, ...EMOJIS].map((e, i) => ({ e, i }))));
  }, []);

  const flip = (idx) => {
    if (open.length === 2 || open.includes(idx) || done.includes(cards[idx].e)) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].e === cards[b].e) {
        setDone((d) => [...d, cards[a].e]);
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 800);
      }
    }
  };

  const won = cards.length > 0 && done.length === EMOJIS.length;

  return (
    <div>
      <Link to="/jogos" className="back-link">← Voltar para jogos</Link>
      <h1>🃏 Memória das Histórias</h1>
      <p className="muted">Movimentos: {moves}</p>
      <div className="memory-grid">
        {cards.map((c, idx) => {
          const isOpen = open.includes(idx) || done.includes(c.e);
          return (
            <button
              key={c.i}
              className={`memory-card ${done.includes(c.e) ? 'done' : isOpen ? 'open' : ''}`}
              onClick={() => flip(idx)}
            >
              {isOpen ? c.e : '❓'}
            </button>
          );
        })}
      </div>
      {won && (
        <div className="score-banner">
          🎉 Você achou todos os pares em {moves} movimentos!{' '}
          <button className="btn green" onClick={() => { setCards(shuffle([...EMOJIS, ...EMOJIS].map((e, i) => ({ e, i })))); setDone([]); setOpen([]); setMoves(0); }}>
            Jogar de novo
          </button>
        </div>
      )}
    </div>
  );
}
