import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, hash) => {
  const link = `${process.env.FRONTEND_URL}/verify_email.html?hash=${hash}`;
  await transporter.sendMail({
    from: `"Folium" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifique seu e-mail para confirmar sua conta',
    html: `
      <p>Olá, ${name}!</p>
      <p>Clique no link abaixo para verificar seu e-mail e ativar sua conta:</p>
      <a href="${link}">Verificar e-mail</a>
    `,
  });
};

export default sendVerificationEmail;

