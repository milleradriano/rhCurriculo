import { Router, Request, Response } from "express";
import Joi from "joi";
import { getExperiencia, postExperiencia } from "../services/experiencia.js";
import { verifyToken } from "../services/services.js";

const router = Router();

// Esquema de validação para GET /experiencia
const experienciaQuerySchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
});

// Esquema de validação para POST /experiencia
const experienciaSchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  primeiroEmprego: Joi.string().valid("S", "N").required(),
  empresa: Joi.string().max(100).allow("").when("primeiroEmprego", {
    is: "N",
    then: Joi.string().min(1).required(),
  }),
  cidade: Joi.string().max(100).allow("").when("primeiroEmprego", {
    is: "N",
    then: Joi.string().min(1).required(),
  }),
  cargo: Joi.string().max(100).allow("").when("primeiroEmprego", {
    is: "N",
    then: Joi.string().min(1).required(),
  }),
});

// GET /experiencia - Buscar experiência por idcandidato e cpf
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = experienciaQuerySchema.validate(req.query, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { idcandidato, cpf } = value;
    const result = await getExperiencia(idcandidato, cpf);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao buscar experiência: " + error.message });
  }
});

// POST /experiencia - Criar ou atualizar experiência
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = experienciaSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const result = await postExperiencia(value);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao criar/atualizar experiência: " + error.message });
  }
});

export default router;