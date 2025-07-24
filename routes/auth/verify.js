import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const router = express.Router();

router.get('/verify', async (req, res) => {
  const { hash } = req.query;

  if (!hash) {
    return res.status(400).send('Código de verificação inválido.');
  }

  // Busca usuário pelo hash
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('hash1', hash)
    .single();

  if (error || !user) {
    return res.status(400).send('Código de verificação inválido ou expirado.');
  }

  // Atualiza usuário para verificado
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ verificado: true, hash1: null }) // opcional: remove o hash para não permitir reuso
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).send('Erro ao confirmar o e-mail.');
  }

  // Pode redirecionar para uma página de sucesso no frontend
  res.redirect(`${process.env.FRONTEND_URL}/email_confirmed.html`);
});

export default router;
