import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import registerRouter from './routes/auth/register.js';
import verifyRouter from './routes/auth/verify.js'; // caminho do arquivo da rota verify

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/register', registerRouter);
app.use('/api/auth', verifyRouter);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

