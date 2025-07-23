import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendLoginCode from '../utils/sendLoginCode.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, name1, password, verificado')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).send('Email ou senha incorretos.');
    if (!user.verificado) return res.status(403).send('Conta não verificada.');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(401).send('Email ou senha incorretos.');

    // Gera código de 6 dígitos
    const loginCode = crypto.randomInt(100000, 999999).toString();

    // req.session depende do middleware express-session estar configurado
    req.session.tempUser = {
      id: user.id,
      name1: user.name1,
      email,
      code: loginCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutos
      rememberMe,
    };

    await sendLoginCode(email, loginCode);

    res.send('Código de confirmação enviado para seu e-mail.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno no servidor.');
  }
};

