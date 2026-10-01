import { Router } from 'express';
import pool from '../db.js';
import { requireUser, userFromRows } from './auth.js';

const router = Router();

// content routes read req.user when present — attach user without rejecting guests
export async function attachUser(req, _res, next) {
  const token = req.cookies.sid;
  if (token) {
    const { rows } = await pool.query(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1`,
      [token]
    );
    if (rows[0]) req.user = rows[0];
  }
  next();
}

router.put('/profile', requireUser, async (req, res) => {
  const { name, avatar, age, favorite_categories } = req.body;
  const { rows } = await pool.query(
    `UPDATE users SET
       name = COALESCE($1, name),
       avatar = COALESCE($2, avatar),
       age = COALESCE($3, age),
       favorite_categories = COALESCE($4, favorite_categories)
     WHERE id = $5 RETURNING *`,
    [name, avatar, age ? Number(age) : null, favorite_categories || null, req.user.id]
  );
  res.json(userFromRows(rows[0]));
});

// Parental area: setting/updating the PIN, and toggling the filter (requires the PIN).
router.put('/parental', requireUser, async (req, res) => {
  const { pin, toggle_filter, current_pin } = req.body;

  if (toggle_filter !== undefined) {
    // changing the filter always requires the PIN (also the very first time it's set)
    if (req.user.parental_pin !== current_pin) {
      return res.status(403).json({ error: 'PIN dos pais incorreto' });
    }
    const { rows } = await pool.query(
      `UPDATE users SET parental_filter = $1 WHERE id = $2 RETURNING *`,
      [!!toggle_filter, req.user.id]
    );
    return res.json(userFromRows(rows[0]));
  }

  if (pin !== undefined) {
    if (req.user.parental_pin && req.user.parental_pin !== current_pin) {
      return res.status(403).json({ error: 'PIN atual incorreto' });
    }
    if (!/^\d{4}$/.test(pin || '')) {
      return res.status(400).json({ error: 'O PIN deve ter 4 números' });
    }
    const { rows } = await pool.query(
      `UPDATE users SET parental_pin = $1 WHERE id = $2 RETURNING *`,
      [pin, req.user.id]
    );
    return res.json(userFromRows(rows[0]));
  }

  res.status(400).json({ error: 'Nada para atualizar' });
});

router.get('/my-results', requireUser, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, q.title FROM quiz_results r JOIN quizzes q ON q.id = r.quiz_id
     WHERE r.user_id = $1 ORDER BY r.created_at DESC LIMIT 10`,
    [req.user.id]
  );
  res.json(rows);
});

export default router;
