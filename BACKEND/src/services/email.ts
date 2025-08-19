import nodemailer from "nodemailer";
import fs from "fs";

// Lê o arquivo HTML
// Substitua pela senha real

const postMail = (email: any, senha: any) => {

  let htmlContent = "";
  htmlContent = fs.readFileSync("./src/htmlEmail/recuperaSenha.html", "utf-8");
  htmlContent = htmlContent.replace("{{senha}}", senha);
  if (!email) {
    throw new Error("E-mail não fornecido");
  }

  return new Promise((resolve, reject) => {
    // Cria o transporte (configuração do servidor SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.superbonato.com.br",
      port: 587,
      secure: false, // true para 465, false para outros
      auth: {
        user: "adriano@superbonato.com.br",
        pass: "@Muwsical0",
      },
      tls: {
        rejectUnauthorized: false, // Evita erro de certificado autoassinado, se existir
      },
    });

    // Configuração da mensagem
    const mailOptions = {
      from: "adriano@superbonato.com.br",
      to: email.email, // Destinatário
      subject: "Recuperação de Senha",
      text: "Olá! Você solicitou uma nova senha.",
      html: htmlContent, // Conteúdo HTML do e-mail
    };

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
export default {
  postMail,
};
