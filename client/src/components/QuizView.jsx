import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../App.jsx';

export default function QuizView() {
  const { id } = useParams();
  const { user, refresh } = useUser();
  const [quiz, setQuiz] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`).then((r) => (r.ok ? r.json() : Promise.reject(r))).then(setQuiz).catch(() => {});
  }, [id]);

  if (!quiz) return <p className="error-text">Teste não encontrado</p>;

  if (result) {
    return (
      <div>
        <Link to="/testes" className="back-link">← Voltar para testes</Link>
        <div className="score-banner">
          ⭐ Você acertou {result.score} de {result.total}! {result.score === result.total ? '🎉 Nota máxima!' : '🐝 Continue tentando!'}
        </div>
        {!user && <p className="muted">Entre na sua conta para guardar suas pontuações.</p>}
        <button className="btn green" onClick={() => { setIdx(0); setAnswers([]); setPicked(null); setResult(null); }}>
          Refazer
        </button>
      </div>
    );
  }

  const q = quiz.questions[idx];

  const answer = async (i) => {
    if (picked !== null) return;
    setPicked(i);
    const next = [...answers, i];
    setAnswers(next);
    setTimeout(async () => {
      setPicked(null);
      if (idx + 1 < quiz.questions.length) {
        setIdx(idx + 1);
      } else {
        const res = await fetch(`/api/quizzes/${id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: next }),
        });
        if (res.ok) {
          setResult(await res.json());
          refresh();
        } else {
          // guest: no saved score — total computed from what they picked
          setResult({ score: next.filter((a, i) => a === quiz.questions[i].answer).length, total: quiz.questions.length, guest: true });
        }
      }
    }, 700);
  };

  return (
    <div>
      <Link to="/testes" className="back-link">← Voltar para testes</Link>
      <h1>{quiz.emoji} {quiz.title}</h1>
      <p className="muted">Pergunta {idx + 1} de {quiz.questions.length}</p>
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
      {idx + 1 === quiz.questions.length && <p className="muted">Última pergunta!</p>}
    </div>
  );
}
