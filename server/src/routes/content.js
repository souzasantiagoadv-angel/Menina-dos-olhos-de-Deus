import { Router } from 'express';
import pool from '../db.js';
import { requireUser } from './auth.js';

const router = Router();

// Content visible to a user respects the parental filter: when the filter is
// on, only content with age_min <= user's age is shown.
function ageClause(user) {
  if (!user || !user.parental_filter) return { sql: '', params: [] };
  return { sql: ` AND age_min <= $1`, params: [user.age || 8] };
}

router.get('/stories', async (req, res) => {
  const user = req.user; // set by optional auth below
  const { testament, category, q } = req.query;
  const { sql, params } = ageClause(user);
  let where = `WHERE 1=1${sql}`;
  const p = [...params];
  if (testament && testament !== 'todos') { p.push(testament); where += ` AND testament = $${p.length}`; }
  if (category && category !== 'todas') { p.push(category); where += ` AND category = $${p.length}`; }
  if (q) { p.push(`%${q}%`); where += ` AND (title ILIKE $${p.length} OR text ILIKE $${p.length})`; }
  const { rows } = await pool.query(
    `SELECT id, title, testament, category, emoji, age_min FROM stories ${where} ORDER BY id`, p
  );
  res.json(rows);
});

router.get('/stories/random', async (req, res) => {
  const user = req.user;
  const { testament } = req.query;
  const { sql, params } = ageClause(user);
  let where = `WHERE 1=1${sql}`;
  const p = [...params];
  if (testament && testament !== 'todos') { p.push(testament); where += ` AND testament = $${p.length}`; }
  const { rows } = await pool.query(
    `SELECT * FROM stories ${where} ORDER BY random() LIMIT 1`, p
  );
  res.json(rows[0] || null);
});

router.get('/stories/:id', async (req, res) => {
  const user = req.user;
  const { sql, params } = ageClause(user);
  const { rows } = await pool.query(
    `SELECT * FROM stories WHERE id = $1${sql}`, [req.params.id, ...params]
  );
  if (!rows[0]) return res.status(404).json({ error: 'História não encontrada' });
  res.json(rows[0]);
});

router.get('/videos', async (req, res) => {
  const user = req.user;
  const { testament, category } = req.query;
  const { sql, params } = ageClause(user);
  let where = `WHERE 1=1${sql}`;
  const p = [...params];
  if (testament && testament !== 'todos') { p.push(testament); where += ` AND testament = $${p.length}`; }
  if (category && category !== 'todas') { p.push(category); where += ` AND category = $${p.length}`; }
  const { rows } = await pool.query(`SELECT * FROM videos ${where} ORDER BY id`, p);
  res.json(rows);
});

router.get('/quizzes', async (req, res) => {
  const user = req.user;
  const { testament } = req.query;
  const { sql, params } = ageClause(user);
  let where = `WHERE 1=1${sql}`;
  const p = [...params];
  if (testament && testament !== 'todos') { p.push(testament); where += ` AND testament = $${p.length}`; }
  const { rows } = await pool.query(
    `SELECT id, title, testament, category, emoji, age_min, jsonb_array_length(questions) AS total FROM quizzes ${where} ORDER BY id`, p
  );
  res.json(rows);
});

router.get('/quizzes/:id', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM quizzes WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Teste não encontrado' });
  res.json(rows[0]);
});

// Rapid-fire game questions drawn at random (answers stripped).
router.get('/quiz-questions/random', async (req, res) => {
  const { count = 10 } = req.query;
  const { rows } = await pool.query(
    `SELECT jsonb_array_elements(questions) AS question FROM quizzes ORDER BY random() LIMIT $1`,
    [Math.min(Number(count) || 10, 20)]
  );
  const questions = rows
    .map((r) => r.question)
    .map(({ q, options }) => ({ q, options }))
    .slice(0, Number(count) || 10);
  res.json(questions);
});

router.post('/quizzes/:id/submit', requireUser, async (req, res) => {
  const { answers } = req.body; // array of chosen indexes
  const { rows } = await pool.query(`SELECT questions FROM quizzes WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Teste não encontrado' });
  const questions = rows[0].questions;
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  await pool.query(
    `INSERT INTO quiz_results (user_id, quiz_id, score, total) VALUES ($1, $2, $3, $4)`,
    [req.user.id, req.params.id, score, questions.length]
  );
  res.json({ score, total: questions.length });
});

export default router;
