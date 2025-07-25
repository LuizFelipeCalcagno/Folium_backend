import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';

// Suas rotas
import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js';
import loginRouter from './routes/auth/login.js';
import confirmRouter from './routes/auth/confirm.js';
import logoutRouter from './routes/auth/logout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ⚠️ Criação do pool de conexão com SSL desabilitado de forma segura (Railway aceita assim)
const pgPool = new pg.Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Sessão com PostgreSQL
const PgSession = pgSession(session);
app.use(session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true, // importante para evitar erro se tabela não existir
  }),
  secret: process.env.SESSION_SECRET || 'chave-padrao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
  },
}));

// Suas rotas
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);
app.use('/api/auth/logout', logoutRouter);

// Health check
app.get('/ping', (_, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
