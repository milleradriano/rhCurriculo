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
 console.log('serv ',hashedPassword);
 if (hashedPassword === undefined) {
    return false
 }
    else return (await bcrypt.compare(password, hashedPassword));
   
   
}

// Função para gerar JWT
function generateToken(user: any) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Função para validar JWT
function verifyToken(token: any) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken };
