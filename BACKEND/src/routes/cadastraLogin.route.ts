import { Router, Request, Response } from "express";
import Joi from "joi";
import  { cadastraLogin } from "../services/cadastraLogin.js";

const router = Router();

// Esquema de validação para POST /login/cadastro
const cadastroLoginSchema = Joi.object({
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().replace(/[^0-9]/g, ""),
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(100).required(),
  senha: Joi.string().min(6).max(50).required(),
  termoUso: Joi.boolean().required().valid(true).messages({
    "any.only": "O termo de uso deve ser aceito."
  }),
});

// POST /login/cadastro - Cadastrar login
router.post("/", async (req: Request, res: Response) => {
  try {
    
    const { error, value } = cadastroLoginSchema.validate(req.body, { abortEarly: false });   
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
   const result = await cadastraLogin(value);
 
   const resultObject = (result)[0];
const codStatus = JSON.parse(result[0][0].result).statusCode;   
const mensagem =  JSON.parse(result[0][0].result).mensagem;
   
    res.status(200).json({ mensagem: mensagem, codStatus: codStatus });
  } catch (error: any) {
    const status = error.message.includes("Dados de cadastro inválidos") ? 400 : 500;
    res.status(status).json({ mensagem: "Erro ao cadastrar login: " + error.message });
  }
});

export default router;