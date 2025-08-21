import { promises as fs } from "fs";
import path from "path";
import { uploadLogo } from "../services/uploadLogo.js";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", uploadLogo.single("logo"), async (req: Request, res: Response) => {
  try {
if (!req.file) {
      return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
    }
    const nomeArquivo = Buffer.from(req.file.originalname, "binary").toString("utf-8");
    console.log("nomeArquivo", nomeArquivo);
    const dados = { logo: nomeArquivo };   
    res.json('result').status(200);
  } catch (error) {}
});

export default router;
