import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLoginCode = async (to, code) => {
  await transporter.sendMail({
    from: `"Folium" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Confirmação de Login",
    html: `
      <h2>Confirmação de Login</h2>
      <p>Use o código abaixo para confirmar seu login:</p>
      <h1>${code}</h1>
      <p>Este código expira em 10 minutos.</p>
    `
  });
};

export default sendLoginCode;


