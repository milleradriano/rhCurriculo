import { Router, Request, Response } from "express";
import Joi from "joi";
import { alteraSenha } from "../services/alteraSenha.js";
import { verifyToken } from "../services/services.js";

const router = Router();

// Esquema de validação para PUT /senha
const senhaSchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  novaSenha: Joi.string().min(6).max(50).required(),
  confirmaSenha: Joi.string().valid(Joi.ref("novaSenha")).required().messages({
    "any.only": "As senhas devem ser iguais.",
  }),
});

// PUT /senha - Alterar senha
router.put("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = senhaSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { idcandidato, cpf, novaSenha } = value;
    const result = await alteraSenha({ codcli: idcandidato, cpf, senha: novaSenha });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao alterar senha: " + error.message });
  }
});

export default router;
/*import {Router, Request, Response} from "express";
import Joi from "joi";
import { verifyToken } from "../services/auth.utils.js";
import  {alteraSenha} from "../services/alteraSenha.js"; 
import { hashPassword } from "../services/services.js";
import email from "../services/email.js";

const router = Router();

router.post("/altera-senha",verifyToken, async (req: Request, res: Response) => {

  try {    
    let valores = req.body;
if (valores.novaSenha.length < 6) {
      res.status(400).send({ error: "A senha deve ter pelo menos 6 caracteres" });
      return;
    } 
if (valores.novaSenha !== valores.confirmaSenha) {
      console.log("compara senha", valores.novaSenha, valores.confirmaSenha);
      res.status(400).send({ error: "As senhas devem sem iguais." });
      return;
    }
 
     let novaSenhaHash = await hashPassword(valores.novaSenha);     
     valores = [valores.idcandidato, valores.cpf.replace(/[^0-9]/g, ""),novaSenhaHash];
     console.log("valores do altera senha NO APP",  req.body);
     const result = await alteraSenha(valores);
     res.send(result);
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).send({ error: "Erro ao alterar senha." });
  }
 });

 export default router
 */