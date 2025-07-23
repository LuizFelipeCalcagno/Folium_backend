import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import authRouter from './routes/auth/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://folium.netlify.app',
  credentials: true,
}));

app.use(express.json());

// Usar todas as rotas de autenticação com o prefixo /auth
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

