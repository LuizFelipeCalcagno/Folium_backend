import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';

import authRouter from './routes/auth/auths.js';
import loginRoutes from './routes/auth/login.js';
import confirmRoutes from './routes/auth/confirm.js';
import logoutRoutes from './routes/auth/logout.js';
import registerRoutes from './routes/auth/register.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,  // exemplo: 'https://folium.netlify.app'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors()); // Habilita preflight OPTIONS

// Middlewares
app.use(cookieParser());
app.set('trust proxy', 1); // se estiver atrás de proxy (ex: Railway, Heroku)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS), false local
    sameSite: 'none', // para permitir cookies cross-site
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth/login', loginRoutes);
app.use('/api/auth/confirm', confirmRoutes);
app.use('/api/auth/logout', logoutRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/auth', authRouter);

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

