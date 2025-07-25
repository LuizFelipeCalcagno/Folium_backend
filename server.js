import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js';
import loginRouter from './routes/auth/login.js';
import confirmRouter from './routes/auth/confirm.js';

dotenv.config();

const app = express();

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
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-super-segura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    httpOnly: true,
    secure: true,                    // ⚠️ importante: Railway precisa de HTTPS
    sameSite: 'none',                // ⚠️ necessário para Netlify + Railway funcionarem juntos
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
