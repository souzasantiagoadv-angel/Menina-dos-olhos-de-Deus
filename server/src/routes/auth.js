import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../db.js';

const router = Router();
const COOKIE = 'sid';
const cookieOpts = { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 30 * 24 * 3600 * 1000 };

export function userFromRows(row) {
  const { password_hash, ...user } = row;
  return user;
}

export async function requireUser(req, res, next) {
  const token = req.cookies[COOKIE];
  if (!token) return res.status(401).json({ error: 'Faça login' });
  const { rows } = await pool.query(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1`,
    [token]
  );
  if (!rows[0]) return res.status(401).json({ error: 'Faça login' });
  req.user = rows[0];
  next();
}

router.post('/signup', async (req, res) => {
  const { name, email, password, age } = req.body;
  if (!name || !email || !password || password.length < 4) {
    return res.status(400).json({ error: 'Preencha tudo (senha com 4+ letras)' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, age) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email.toLowerCase(), hash, Number(age) || 8]
    );
    const token = crypto.randomUUID();
    await pool.query(`INSERT INTO sessions (token, user_id) VALUES ($1, $2)`, [token, rows[0].id]);
    res.cookie(COOKIE, token, cookieOpts);
    res.json(userFromRows(rows[0]));
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Este e-mail já tem conta' });
    throw e;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [(email || '').toLowerCase()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos' });
  }
  const token = crypto.randomUUID();
  await pool.query(`INSERT INTO sessions (token, user_id) VALUES ($1, $2)`, [token, user.id]);
  res.cookie(COOKIE, token, cookieOpts);
  res.json(userFromRows(user));
});

router.post('/logout', (req, res) => {
  const token = req.cookies[COOKIE];
  if (token) pool.query(`DELETE FROM sessions WHERE token = $1`, [token]);
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  const token = req.cookies[COOKIE];
  if (!token) return res.json(null);
  const { rows } = await pool.query(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1`,
    [token]
  );
  res.json(rows[0] ? userFromRows(rows[0]) : null);
});

export default router;
