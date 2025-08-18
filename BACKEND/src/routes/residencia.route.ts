import { Router, Request, Response } from "express";
import Joi from "joi";
import {
  getResidencia,
  postResidencia,
  delResidencia,
} from "../services/residencia.js";
import { verifyToken } from "../services/services.js";

const router = Router();

// Esquema de validação para GET /residencia
const residenciaQuerySchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
});

// Esquema de validação para POST /residencia
const residenciaSchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  cep: Joi.string()
    .pattern(/^\d{8}$/)
    .required(),
  estado: Joi.string().length(2).required(),
  cidade: Joi.string().max(100).required(),
  endereco: Joi.string().max(200).required(),
  bairro: Joi.string().max(100).required(),
  numero: Joi.string().max(20).required(),
});

// GET /residencia - Buscar residência por idcandidato e cpf
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = residenciaQuerySchema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { idcandidato, cpf } = value;
    console.log("params", `${idcandidato} ${cpf}`);
    const result = await getResidencia(idcandidato, cpf);
    res.json(result);
  } catch (error: any) {
    res
      .status(400)
      .json({ mensagem: "Erro ao buscar residência: " + error.message });
  }
});

// POST /residencia - Criar ou atualizar residência
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = residenciaSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const result = await postResidencia(value);
    res.json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({
        mensagem: "Erro ao criar/atualizar residência: " + error.message,
      });
  }
});

// DELETE /residencia/:id - Deletar residência por idcandidato
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ mensagem: "ID do candidato inválido." });
    }
    const result = await delResidencia(id);
    res.json(result);
  } catch (error: any) {
    res
      .status(400)
      .json({ mensagem: "Erro ao deletar residência: " + error.message });
  }
});

export default router;
