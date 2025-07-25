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

const PgSession = pgSession(session);
const app = express();

const pgPool = new pg.Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário se for Railway com SSL
  },
});

// CORS com credenciais e origem liberada para o frontend hospedado
app.use(cors({
  origin: process.env.FRONTEND_URL, // ex: 'https://folium.netlify.app'
  credentials: true,
}));

// Body parser e cookie parser
app.use(express.json());
app.use(cookieParser());

// Sessão configurada para ambientes cross-domain (Netlify + Railway)
app.use(session({
  store: new PgSession({
    pool: pgPool, // sua conexão com PostgreSQL
    tableName: 'user_sessions', // nome da tabela que vai armazenar as sessões
  }),
  secret: process.env.SESSION_SECRET || 'uma-chave-super-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 minutos ou o tempo que quiser
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));

// Rotas da API
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);

// Teste rápido
app.get('/ping', (req, res) => res.send('pong'));

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
