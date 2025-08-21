import { Router, Request, Response } from "express";
import Joi from "joi";
import { getEmpresa, postEmpresa, delEmpresa } from "../services/empresa.js";
import { verifyToken } from "../services/services.js";

const router = Router();

// Esquema de validação para POST /empresa
const empresaSchema = Joi.object({
  idempresa: Joi.number().integer().required(),
  descempresa: Joi.string().min(3).max(100).required(),
  desccidade: Joi.string().max(100).required(),
  maps: Joi.string().uri().max(500).allow("").required(),
  logo: Joi.string().max(200).allow("").required(),
});

// GET /empresa - Listar todas as empresas
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getEmpresa();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao buscar empresas: " + error.message });
  }
});

// POST /empresa - Criar ou atualizar uma empresa
router.post("/",  async (req: Request, res: Response) => {
  try {
    const { error, value } = empresaSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const result = await postEmpresa([value]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao criar/atualizar empresa: " + error.message });
  }
});

// DELETE /empresa/:id - Deletar uma empresa por ID
router.delete("/:id",  async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ mensagem: "ID da empresa inválido." });
    }
    const result = await delEmpresa(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao deletar empresa: " + error.message });
  }
});

export default router;