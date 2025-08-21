import { Router, Request, Response } from "express";
import { uploadLogo } from "../services/uploadLogo.js";
import express from "express";
import path from "path";

const router = Router();

const uploadDir = path.resolve("src/images/logo");


router.post("/", uploadLogo.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }
  return res.json({
    message: "Upload realizado com sucesso!",
    file: req.file.filename,
    path: req.file.path,
  });
});


router.get("/:fileName", (req: Request, res: Response) => {
console.log("Requisição para arquivo:", req.params.fileName);
  if (!req.params.fileName) {
    return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
  }
    const filePath = path.join(uploadDir, req.params.fileName);
    console.log("Caminho do arquivo:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ mensagem: "Arquivo não encontrado." });
    }
  });
});

export default router;