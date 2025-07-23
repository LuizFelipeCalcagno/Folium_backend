import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import authRouter from './routes/auth/auths.js';

dotenv.config();

const app = express();

// 🚨 CORS configurado para frontend no Netlify
const corsOptions = {
  origin: 'https://folium.netlify.app', // frontend
  credentials: true,                    // 🔑 permite cookies
};
app.use(cors(corsOptions));

// 🚨 Middleware para cookies/sessões cross-origin
app.set('trust proxy', 1); // Necessário se Railway usa proxy (HTTPS)
app.use(session({
  secret: process.env.SESSION_SECRET, // coloque uma chave forte no .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // 🔑 obrigatório no Railway (HTTPS)
    sameSite: 'none',  // 🔑 permite cookies cross-origin
  },
}));

// 📦 JSON body parser
app.use(express.json());

// 🌐 Rotas de autenticação
app.use("/auth", authRouter);

// 🚀 Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

