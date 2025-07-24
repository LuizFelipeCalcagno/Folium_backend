import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import registerRoute from './routes/auth/register.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Aqui registramos a rota corretamente
app.use('/api/auth/register', registerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

