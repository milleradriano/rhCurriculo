import { Router, Request, Response } from "express";
import Joi from "joi";
import { getDocumento, postDocumento, deleteDocumento } from "../services/documento.js";
import { verifyToken } from "../services/services.js";
import {apagaDocumentoStorage}  from "../services/uploadArquivoDocumento.js";
 // Assumindo que multer está configurado

const router = Router();

// Esquema de validação para GET /documento
const documentoQuerySchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
});

// Esquema de validação para POST /uploaddocumento


// Esquema de validação para DELETE /documento/:idcandidato/:cpf/:nome
const documentoDeleteSchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  nome: Joi.string().max(100).required(),
});

// GET /documento - Buscar documentos por idcandidato e cpf
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {   
    const { error, value } = documentoQuerySchema.validate(req.query, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const { idcandidato, cpf } = value;
    const result = await getDocumento(idcandidato, cpf);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao buscar documentos: " + error.message });
  }
});

// POST /uploaddocumento - Criar ou atualizar documento com upload

// DELETE /documento/:idcandidato/:cpf/:nome - Deletar documento
router.delete("/:idcandidato/:cpf/:nome", verifyToken, async (req: Request, res: Response) => {
  try {
  
    const { idcandidato, cpf, nome } = req.params;
    const { error, value } = documentoDeleteSchema.validate(
      { idcandidato: Number(idcandidato), cpf, nome },
      { abortEarly: false }
    );
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem: "problema ao excluir" });
    }
    const result = await deleteDocumento(value);
    res.json(result);
    apagaDocumentoStorage(`${idcandidato}`, nome);
  } catch (error: any) {
    res.status(400).json({ mensagem: "Erro ao deletar documento: " + error.message });
  }
});

export default router;