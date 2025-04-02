require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const saltRounds = 12; // Segurança do hash

// Função para criptografar senha
async function hashPassword(password: any) {
  return await bcrypt.hash(password, saltRounds);
}

// Função para verificar senha
async function verifyPassword(password: any, hashedPassword : any) {
 console.log('verifyPassword services.ts 17 ',hashedPassword);
 if (hashedPassword === undefined) {
    console.log('verifyPassword services.ts 19 undefined',hashedPassword);
    return false
 }
    else 
    console.log('verifyPassword services.ts 19 undefined',hashedPassword);
    return (await bcrypt.compare(password, hashedPassword));
   
   
}

// Função para gerar JWT
function generateToken(user: {cpf:string, senha:string}) {
  console.log("dentro do generateToken", user);
  return jwt.sign({ cpf: user.cpf, senha: user.senha }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Função para validar JWT
function verifyToken(req : any, res : any, next: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Pega apenas o token sem o "Bearer"
  console.log("verifyToken no service", authHeader);
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

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken };
