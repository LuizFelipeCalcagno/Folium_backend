require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const loginRoutes = require('./routes/auth/login');
const confirmRoutes = require('./routes/auth/confirm');
const logoutRoutes = require('./routes/auth/logout');
const registerRoutes = require('./routes/auth/register');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS para Netlify
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

// 🛣️ Rotas
app.use('/api/auth/login', loginRoutes);
app.use('/api/auth/confirm', confirmRoutes);
app.use('/api/auth/logout', logoutRoutes);
app.use('/api/auth/register', registerRoutes); // ✅ NOVO

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
