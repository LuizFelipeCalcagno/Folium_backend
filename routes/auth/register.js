// routes/auth/register.js
import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  const { email, password, confipassword, name } = req.body;

  // Aqui você pode fazer validações ou salvar no banco
  res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

export default router;
