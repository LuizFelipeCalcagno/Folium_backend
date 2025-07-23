exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Erro ao fazer logout.');
    res.clearCookie('connect.sid');
    res.send('Logout realizado com sucesso.');
  });
};
