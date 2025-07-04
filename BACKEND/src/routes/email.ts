const nodemailer = require('nodemailer');
const fs = require('fs');

// Lê o arquivo HTML
let htmlContent = fs.readFileSync('./src/htmlEmail/recuperaSenha.html', 'utf-8');
 // Substitua pela senha real

const postMail = (email : any) => {
 htmlContent = htmlContent.replace('{{senha}}', 'SuaNovaSenhaAqui');
  console.log('Iniciando o envio de e-mail para:', email.email);
  if (!email) {
    throw new Error('Email não fornecido');
  }

  return new Promise((resolve, reject) => {
    // Cria o transporte (configuração do servidor SMTP)
    const transporter = nodemailer.createTransport({
      host: 'smtp.superbonato.com.br',
      port: 587,
      secure: false, // true para 465, false para outros
      auth: {
        user: 'adriano@superbonato.com.br',
        pass: '@Muwsical0'
      },
      tls: {
        rejectUnauthorized: false // Evita erro de certificado autoassinado, se existir
      }
    });

    // Configuração da mensagem
    const mailOptions = {
      from: 'adriano@superbonato.com.br',
      to: email.email, // Destinatário
      subject: 'Teste de envio de e-mail',
      text: 'Olá! Este é um e-mail enviado pelo Node.js usando nodemailer.',
      html: htmlContent // Conteúdo HTML do e-mail
    };

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        reject(error);
      } else {
        console.log('E-mail enviado:', info.response);
        resolve(info.response);
      }
    });
  });
};
module.exports = {
  postMail
};
