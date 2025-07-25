import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js';
import loginRouter from './routes/auth/login.js';
import confirmRouter from './routes/auth/confirm.js';

dotenv.config();

const app = express();

// Configuração do CORS para aceitar o frontend com credenciais
app.use(cors({
  origin: process.env.FRONTEND_URL,  // ex: 'https://folium.netlify.app'
  credentials: true,
}));

// Responde a requisições OPTIONS para todos os endpoints (preflight)
app.options('*', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Parse do corpo da requisição como JSON
app.use(express.json());

// Parse de cookies (se for usar sessão depois)
app.use(cookieParser());

// Rotas
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);

// Rota de teste simples para garantir que o servidor está rodando
app.get('/ping', (req, res) => res.send('pong'));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

