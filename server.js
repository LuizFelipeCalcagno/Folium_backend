// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

// Importar as rotas
import authRouter from './routes/auth/auths.js';
import loginRoutes from './routes/auth/login.js';
import confirmRoutes from './routes/auth/confirm.js';
import logoutRoutes from './routes/auth/logout.js';
import registerRoutes from './routes/auth/register.js';

// Carrega as variáveis do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 CORS para permitir o frontend hospedado no Netlify
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// 🔐 Cookies e sessões
app.set('trust proxy', 1); // necessário se estiver usando HTTPS via proxy (Railway)
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,       // obrigatório no Railway (HTTPS)
    sameSite: 'none',   // permite envio de cookies entre domínios
  },
}));

// 📦 Parse de corpo JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Rotas
app.use('/api/auth/login', loginRoutes);
app.use('/api/auth/confirm', confirmRoutes);
app.use('/api/auth/logout', logoutRoutes);
app.use('/api/auth/register', registerRoutes);
app.use("/auth", authRouter); // caso você tenha outras rotas agrupadas

// 🚀 Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

