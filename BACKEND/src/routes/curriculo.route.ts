import { Router, Request, Response } from "express";
import Joi from "joi";
import { verifyToken } from "../services/services.js";
import {
  getCurriculo,
  postCurriculo,
  deleteCurriculo,
} from "../services/curriculo.js";
import { validaIdade } from "../utils/helpers.js";

const router = Router();

// Esquema de validação para POST /curriculo
const curriculoSchema = Joi.object({
  idcandidato: Joi.alternatives()
    .try(Joi.string().pattern(/^\d+$/), Joi.number().integer())
    .required(),

  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  nome: Joi.string().min(3).max(100).required(),
  dataNascimento: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  sexo: Joi.string().valid("M", "F").required(),
  email: Joi.string().email().required(),
  rg: Joi.string().min(3).max(20).required(),
  orgaoEmissor: Joi.string().max(50).required(),
  estadoEmissor: Joi.string().length(2).required(),
  dataEmissao: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  nomePai: Joi.string().max(100).allow(""),
  nomeMae: Joi.string().max(100).allow(""),
  grauInstrucao: Joi.string().max(50).required(),
  pcd: Joi.string().valid("S", "N").required(),
  deficiencia: Joi.string().max(100).allow(""),
  estudaAtualmente: Joi.string().valid("S", "N").required(),
  turno: Joi.string().max(20).allow(""),
  filhos: Joi.string().valid("S", "N").required(),
  numFilhos: Joi.string().pattern(/^\d+$/).allow("0"),
  telefone: Joi.string()
    .pattern(/^[()\-\s\d]+$/)
    .required(),
  estadoCivil: Joi.string().max(20).required(),
});

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const cpf = (req.query.cpf as string)?.replace(/[^0-9]/g, "");
    const result = await getCurriculo(cpf);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
   
    const { error, value } = curriculoSchema.validate(req.body, {
      abortEarly: false,
    });
   
    if (error) {
    
      const mensagem = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ mensagem });
    }

    const idade = validaIdade(value.datanascimento);
    if (idade < 14) {
      return res
        .status(400)
        .json({ mensagem: "Você precisa ser maior de 14 anos." });
    }
    if (new Date(value.dataEmissao) < new Date(value.datanascimento)) {
      return res
        .status(419)
        .json({ mensagem: "Data de emissão do RG inválida." });
    }

    const dados = {
      idcandidato: value.idcandidato,
      cpf: value.cpf,
      nome: value.nome,
      datanascimento: value.dataNascimento,
      sexo: value.sexo,
      email: value.email,
      rg: value.rg,
      orgaoemissorrg: value.orgaoEmissor,
      estadorg: value.estadoEmissor,
      dataexpedicaorg: value.dataEmissao,
      nomepai: value.nomePai,
      nomemae: value.nomeMae,
      grauinstrucao: value.grauInstrucao,
      pcd: value.pcd,
      pcddeficiencia: value.deficiencia,
      estudaatualmente: value.estudaAtualmente,
      turnoestuda: value.estudaAtualmente === "S" ? value.turno : "",
      possuifilho: value.filhos,
      numFilhos: value.filhos === "S" ? value.numFilhos : "0",
      telefone: value.telefone,
      estadocivil: value.estadoCivil,
    };
   
    const result = await postCurriculo(dados);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteCurriculo(id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
});

export default router;
