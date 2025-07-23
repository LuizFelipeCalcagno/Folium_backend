export const confirmLogin = (req, res) => {
  const { code } = req.body;

  if (!req.session.tempUser) {
    return res.status(400).send('Nenhuma tentativa de login pendente.');
  }

  const { tempUser } = req.session;

  if (Date.now() > tempUser.expiresAt) {
    req.session.tempUser = null;
    return res.status(400).send('Código expirado. Faça login novamente.');
  }

  if (code !== tempUser.code) {
    return res.status(401).send('Código incorreto.');
  }

  req.session.user_id = tempUser.id;
  req.session.user_nome = tempUser.name1;

  req.session.cookie.maxAge = tempUser.rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 dias
    : null;

  req.session.tempUser = null;

  res.send(`Login confirmado! Bem-vindo, ${req.session.user_nome}.`);
};


