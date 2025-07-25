import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';

import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js'; 
import loginRouter from './routes/auth/login.js';
import confirmRouter from './routes/auth/confirm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Pool de conexão com PostgreSQL (Railway exige SSL)
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// CORS e OPTIONS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.options('*', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Sessão com PostgreSQL
const PgSession = pgSession(session);
app.use(session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-super-segura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// Rotas
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);

// Health check (opcional)
app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
