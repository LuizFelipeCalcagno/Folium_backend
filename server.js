import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,  // exemplo: 'https://folium.netlify.app'
  credentials: true, // importante para enviar cookies entre domínios
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-super-segura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
}));

// Rotas
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/verify', verifyRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/confirm', confirmRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

