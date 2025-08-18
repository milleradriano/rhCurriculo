import { Router, Request, Response } from "express";
import Joi from "joi";
import { getDocumento, postDocumento, deleteDocumento } from "../services/documento.js";
import { verifyToken } from "../services/services.js";
import { uploadDocumento } from "../services/uploadArquivoDocumento.js"; 

const router = Router();
const documentoUploadSchema = Joi.object({
  idcandidato: Joi.number().integer().positive().required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
});
router.post("/", verifyToken, uploadDocumento.single("documento"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
    }
    const { error, value } = documentoUploadSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }
    const nomeArquivo = Buffer.from(req.file.originalname, "binary").toString("utf-8");
    console.log("nomeArquivo", nomeArquivo);
    const dados = { ...value, documento: nomeArquivo };
    const result = await postDocumento(dados);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ mensagem: "Erro ao criar/atualizar documento: " + error.message });
  }
});
export default router;