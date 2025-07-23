import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'

import authRouter from './routes/auth/auths.js'
import loginRoutes from './routes/auth/login.js'
import confirmRoutes from './routes/auth/confirm.js'
import logoutRoutes from './routes/auth/logout.js'
import registerRoutes from './routes/auth/register.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// --- Configuração CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.options('*', cors())  // Habilita preflight para todas as rotas

// --- Middlewares ---
app.use(cookieParser())
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  },
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Rotas ---
app.use('/api/auth/login', loginRoutes)
app.use('/api/auth/confirm', confirmRoutes)
app.use('/api/auth/logout', logoutRoutes)
app.use('/api/auth/register', registerRoutes)
app.use('/auth', authRouter)

// --- Start ---
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
