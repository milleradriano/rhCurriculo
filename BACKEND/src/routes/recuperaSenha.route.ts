import { Router, Request, Response } from "express";
import Joi from "joi";
import { recuperaSenha } from "../services/recuperaSenha.js";
import  postMail  from "../services/email.js";

const router = Router();
// Esquema de validação para PUT /recuperaSenha
const recuperaSenhaSchema = Joi.object({
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().replace(/[^0-9]/g, ""),
  email: Joi.string().email().max(100).required(),
});

// PUT /recuperaSenha - Recuperar senha
router.put("/", async (req: Request, res: Response) => {
  try {
   
    const { error, value } = recuperaSenhaSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { cpf, email } = value;
    const novaSenha = Math.random().toString(36).slice(-6); // Gera senha aleatória de 6 caracteres
   const result = await recuperaSenha({ cpf, email, senha: novaSenha })

    if (result.affectedRows === 1) {
      await postMail.postMail({ cpf, email }, novaSenha); // Envia e-mail com a nova senha
      res.json({ mensagem: "Senha recuperada com sucesso. Verifique seu e-mail." });
    } else {
      console.log("email não encontrado", email);
      res.json({ mensagem: "Senha recuperada com sucesso. Verifique seu e-mail." });
    }
  } catch (error: any) {
    const status = error.message.includes("Usuário não encontrado") ? 404 : 500;
    res.status(status).json({ mensagem: "Erro ao recuperar senha: " + error.message });
  }
});

export default router;