import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function QuizGame() {
  const [questions, setQuestions] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const load = async () => {
    const qs = await (await fetch('/api/quiz-questions/random?count=10')).json();
    setQuestions(qs);
    setIdx(0); setPicked(null); setScore(0);
  };

  useEffect(() => { load(); }, []);

  if (questions === null) return <p className="muted">Carregando...</p>;

  if (idx >= questions.length) {
    return (
      <div>
        <Link to="/jogos" className="back-link">← Voltar para jogos</Link>
        <div className="score-banner">
          ⚡ Pontuação: {score}/{questions.length} {score >= 7 ? '🎉 Incrível!' : '🐝 Continue zumbindo!'}
        </div>
        <button className="btn green" onClick={load}>Jogar de novo</button>
      </div>
    );
  }

  const q = questions[idx];

  const answer = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    setTimeout(() => { setIdx((n) => n + 1); setPicked(null); }, 900);
  };

  return (
    <div>
      <Link to="/jogos" className="back-link">← Voltar para jogos</Link>
      <h1>⚡ Quiz Relâmpago</h1>
      <p className="muted">Pergunta {idx + 1} de {questions.length} · Acertos: {score}</p>
      <div className="story-reader">
        <h3>{q.q}</h3>
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option ${picked === null ? '' : i === q.answer ? 'correct' : picked === i ? 'wrong' : ''}`}
            onClick={() => answer(i)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
