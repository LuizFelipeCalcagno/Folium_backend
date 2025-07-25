import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js';
import loginRouter from './routes/auth/login.js';
import confirmRouter from './routes/auth/confirm.js';

dotenv.config();

const app = express();

// Configuração CORS - aceitar requisições do frontend e permitir cookies
app.use(cors({
  origin: process.env.FRONTEND_URL,  // exemplo: 'http://localhost:5173' ou domínio real
  credentials: true,
}));

// Parser para JSON e cookies
app.use(express.json());
app.use(cookieParser());

// Configuração da sessão com PostgreSQL
const PgSession = connectPgSimple(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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
    secure: process.env.NODE_ENV === 'production', // ativa somente em HTTPS produção
    sameSite: 'lax',
  },
}));

// Suas rotas
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
