import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import winston from "winston";

// Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no .env");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const SALT_ROUNDS = 12;

// Interface para o payload do JWT
interface JwtPayload {
  cpf: string;
  role?: string;
}

// Função para hashear senha
export async function hashPassword(senha: string): Promise<string> {
  if (!senha || typeof senha !== "string") {
    throw { status: 400, message: "Senha inválida." };
  }
  return bcrypt.hash(senha, SALT_ROUNDS);
}

// Função para verificar senha
export async function verifyPassword(senha: string, hashedPassword: string): Promise<boolean> {
  if (!senha || !hashedPassword) {
    throw { status: 400, message: "Senha ou hash inválido." };
  }
  return bcrypt.compare(senha, hashedPassword);
}

// Função para gerar JWT
export async function generateToken(user: JwtPayload): Promise<string> {
  if (!user.cpf) {
    throw { status: 400, message: "CPF é obrigatório para gerar o token." };
  }
  const payload = { cpf: user.cpf, role: user.role || "user" };
  logger.info("Gerando token", { cpf: user.cpf });
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Função para verificar JWT
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Pega o token após "Bearer"

  if (!token) {
    return res.status(401).json({ mensagem: "Acesso negado! Token não fornecido." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.error("Erro na verificação do token", { error: err.message });
      return res.status(403).json({ mensagem: "Token inválido ou expirado." });
    }
    req.user = user; // Salva o usuário autenticado na requisição
    next();
  });
}