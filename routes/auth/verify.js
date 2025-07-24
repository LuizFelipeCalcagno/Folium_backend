// routes/auth/verify.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.get('/:hash', async (req, res) => {
  const { hash } = req.params;

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('hash_verificacao', hash)
    .single();

  if (error || !user) {
    return res.status(400).send('<h2>Link inválido ou expirado.</h2>');
  }

  if (user.verificado) {
    return res.send('<h2>Conta já verificada.</h2>');
  }

  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ verificado: true, hash_verificacao: null }) // remove hash
    .eq('id', user.id);

  if (updateError) {
    console.error(updateError);
    return res.status(500).send('<h2>Erro ao verificar sua conta.</h2>');
  }

  res.send(`<h2>Conta verificada com sucesso! Você já pode fazer login.</h2>`);
});

export default router;

