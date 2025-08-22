import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || 500;
  const message = err.message || "Erro interno no servidor.";
  res.status(status).json({ mensagem: message });
}