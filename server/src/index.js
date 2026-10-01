import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';
import profileRouter, { attachUser } from './routes/profile.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api', attachUser, contentRouter);
app.use('/api', attachUser, profileRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro no servidor' });
});

const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => console.log(`API on :${port}`));
