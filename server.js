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
  origin: process.env.FRONTEND_URL,  // ex: 'https://folium.netlify.app'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors()); // Habilita preflight OPTIONS

// Middlewares
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função auxiliar para registrar rota e logar
function registerRoute(path, router) {
  console.log(`Registrando rota: ${path}`);
  app.use(path, router);
}

// Rotas - aqui o primeiro parâmetro deve ser a rota (path), não arquivo
registerRoute('/api/auth/login', loginRoutes);
//registerRoute('/api/auth/confirm', confirmRoutes);
//registerRoute('/api/auth/logout', logoutRoutes);
//registerRoute('/api/auth/register', registerRoutes);
//registerRoute('/auth', authRouter);

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
