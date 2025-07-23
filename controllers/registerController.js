const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const cors = require('cors');

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// CORS middleware (libera Netlify)
const corsOptions = {
  origin: "https://folium.netlify.app", // frontend no Netlify
  credentials: true,
};
app.use(cors(corsOptions)); // adicione isso no index.js principal do backend

exports.registerUser = async (req, res) => {
  const { email, password, confipassword, name } = req.body;

  if (!email || !password || !confipassword || !name) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (password !== confipassword) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  try {
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Esse e-mail já está registrado.' });
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
      return res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }

    return res.status(201).json({
      message: 'Usuário registrado com sucesso! Verifique seu e-mail para ativar a conta.'
    });
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};
