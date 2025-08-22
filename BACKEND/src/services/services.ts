/*import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string ; // Ex.: "1h", "2d"
const saltRounds = 1; // Segurança do hash

// Função para criptografar senha
async function hashPassword(password: any) {
  return await bcrypt.hash(password, saltRounds);
}

// Função para verificar senha
 async function verifyPassword(password: any, hashedPassword : any) {

 if (hashedPassword === undefined) {
    return false
 }
    else 
    return (await bcrypt.compare(password, hashedPassword));
   
   
}

// Função para gerar JWT
function generateToken(user: {cpf:string, senha:string}) {
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined");
  }
  return jwt.sign({ cpf: user.cpf, senha: user.senha }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string | number,
  });
}

// Função para validar JWT
function verifyToken(req : any, res : any, next: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Pega apenas o token sem o "Bearer"
  
  if (req.path === "/cep") {
    console.log("libera cep");
    return next(); // Se for a rota de login, não precisa verificar o token
  } 
  if (!token) {
      return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
      }  
      req.user = user; // Salva o usuário autenticado na requisição
      next(); // Continua para a próxima função na rota
    });
}

export  { hashPassword, verifyPassword, generateToken, verifyToken };
*/

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const saltRounds = 12; // Recomendado para produção

// Função para criptografar senha
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Função para gerar JWT
export function generateToken(cpf: string): string {
  if (!JWT_SECRET) {
    const error = new Error("JWT_SECRET não está definido.");
    error.status = 500;
    throw error;
  }
  if (!JWT_EXPIRES_IN) {
    const error = new Error("JWT_EXPIRES_IN não está definido.");
    error.status = 500;
    throw error;
  }
  return jwt.sign({ cpf }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "rh-curriculo",
    audience: "api.rh-curriculo",
  });
}

// Função para validar JWT
export function verifyToken(req: any, res: any, next: any): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (req.path === "/cep") {
    return next(); // Libera rota /cep sem autenticação
  }
  if (!token) {
    const error = new Error("Token não fornecido.");
    error.status = 401;
    throw error;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET, {
      issuer: "rh-curriculo",
      audience: "api.rh-curriculo",
    }) as { cpf: string };
    req.user = user;
    next();
  } catch (error: any) {
    const err = new Error("Token inválido ou expirado.");
    err.status = 401;
    throw err;
  }
}