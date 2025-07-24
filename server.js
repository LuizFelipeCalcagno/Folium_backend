import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';

import authRouter from './routes/auth/auths.js';

dotenv.config();

console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors());

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

// Função para registrar rota com log
function registerRoute(path, router) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    console.error('ERRO: path inválido passado para app.use:', path);
  } else {
    console.log(`Registrando rota: ${path}`);
    app.use(path, router);
  }
}

// Registra as rotas
registerRoute('/auth', authRouter);

// Log de rotas registradas — coloque isso *depois* do registro das rotas
app._router.stack.forEach((layer) => {
  if (layer.route && layer.route.path) {
    console.log('Rota:', layer.route.path);
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach((handler) => {
      if (handler.route && handler.route.path) {
        console.log('Sub-rota:', handler.route.path);
      } else if (handler.name === 'router' && handler.handle.stack) {
        handler.handle.stack.forEach((subhandler) => {
          console.log('Sub-sub-rota:', subhandler.route?.path);
        });
      }
    });
  }
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


