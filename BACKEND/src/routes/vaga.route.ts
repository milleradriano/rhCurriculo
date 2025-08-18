import { Router, Request, Response } from "express";
import Joi from "joi";
import { getVaga, postVaga, deleteVaga, getVagaId, postVagaCandidato } from "../services/vaga.js";
import { verifyToken } from "../services/services.js";

const router = Router();

// Esquema de validação para POST /vaga
const vagaSchema = Joi.object({
  idempresa: Joi.number().integer().required(),
  titulo: Joi.string().min(3).max(100).required(),
  descricao: Joi.string().min(10).max(1000).required(),
  salario: Joi.number().positive().allow(0).required(),
  localizacao: Joi.string().max(100).required(),
  tipo: Joi.string().valid("CLT", "PJ", "Estágio", "Freelance").required(),
  dataPublicacao: Joi.date().iso().required(),
});

// Esquema de validação para POST /vaga-candidato
const vagaCandidatoSchema = Joi.object({
  idvaga: Joi.number().integer().positive().required(),
  idcandidato: Joi.number().integer().positive().required(),
});

// GET /vaga - Listar todas as vagas
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getVaga();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao buscar vagas: " + error.message });
  }
});

// POST /vaga - Criar uma nova vaga
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = vagaSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const result = await postVaga([value]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao criar vaga: " + error.message });
  }
});

// DELETE /vaga/:id - Deletar uma vaga por ID
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ mensagem: "ID da vaga inválido." });
    }
    const result = await deleteVaga(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao deletar vaga: " + error.message });
  }
});

// GET /vaga/:id - Buscar uma vaga por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
  
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ mensagem: "ID da vaga inválido." });
    }
    const result = await getVagaId(id);
  
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao buscar vaga: " + error.message });
  }
});

// POST /vaga-candidato - Associar candidato a uma vaga
router.post("/vaga-candidato", verifyToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = vagaCandidatoSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { idvaga, idcandidato } = value;
    const result = await postVagaCandidato([idvaga, idcandidato]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao associar candidato à vaga: " + error.message });
  }
});

export default router;