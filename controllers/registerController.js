const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.registerUser = async (req, res) => {
  const { email, password, confipassword, name } = req.body;

  if (!email || !password || !confipassword || !name) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  if (password !== confipassword) {
    return res.status(400).send('As senhas não coincidem.');
  }

  try {
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).send('Esse e-mail já está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();

    await sendVerificationEmail(email, name, hash);

    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{
        name1: name,
        email: email,
        password: hashedPassword,
        verificado: false,
        hash1: hash,
      }]);

    if (insertError) {
      console.error('Erro ao registrar usuário:', insertError);
      return res.status(500).send('Erro ao registrar usuário.');
    }

    return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>Registro concluído</title>
<style>
  .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; font-family: "Ligconsolata", sans-serif; font-weight: bold; }
  .popup { background-color: #f7f7f7; padding: 30px 40px; border-radius: 30px; box-shadow: 0 0 20px #00000055; max-width: 400px; width: 90%; text-align: center; color: #000000; }
  .popup h2 { margin-top: 0; font-size: 28px; margin-bottom: 15px; }
  .popup p { font-size: 16px; margin-bottom: 25px; }
  .popup button { background-color: #8752D2; border: none; border-radius: 50px; padding: 12px 25px; color: white; font-weight: bold; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease; font-family: "Ligconsolata", sans-serif; }
  .popup button:hover { background-color: #6b3bb8; }
</style>
</head>
<body>
  <div class="popup-overlay">
    <div class="popup">
      <h2>Registro concluído</h2>
      <p>O código foi enviado para seu e-mail. Verifique para ativar sua conta.</p>
      <button onclick="window.location.href='../index.html'">Ir para Login</button>
    </div>
  </div>
</body>
</html>`);
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).send('Erro no servidor.');
  }
};
