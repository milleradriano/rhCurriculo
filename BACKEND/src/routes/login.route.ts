import { Router, Request, Response } from "express";
import Joi from "joi";
import { postLogin } from "../services/login.js";
import { verifyPassword, generateToken } from "../services/services.js";

const router = Router();

// Esquema de validação para POST /login
const loginSchema = Joi.object({
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().replace(/[^0-9]/g, ""),
  senha: Joi.string().min(6).max(50).required(),
});

// POST /login - Autenticar usuário
router.post("/", async (req: Request, res: Response) => {  
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }

    const { cpf, senha } = value;
    const results: any = await postLogin({ cpf });

    if (!results?.[0]?.[0]) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválida." });
    }

    const usuario = results[0][0];
    if (usuario.SITUACAO === "B") {
      return res.status(429).json({ mensagem: "Excesso de tentativas, tente mais tarde." });
    }

    const senhaValida = await verifyPassword(senha, usuario.SENHA);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválida." });
    }

    const token = await generateToken(cpf);
    res.json({ token });
  } catch (error: any) {
    res.status(503).json({ mensagem: "Serviço indisponível, tente mais tarde." });
  }
});

export default router;