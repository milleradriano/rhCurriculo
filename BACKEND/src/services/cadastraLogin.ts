import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";
import { hashPassword } from "./services.js";

interface CadastraLoginInput {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  termoUso: boolean;
}

const executeQuery = (query: string, params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    PoolMysql.query(query, params, (error, results) => {
      if (error) {
        console.error("Erro na query:", error);
        reject(new Error("Erro ao acessar o banco de dados."));
      } else {
        resolve(results);
      }
    });
  });
};

export  const cadastraLogin = async (dados: CadastraLoginInput): Promise<any> => {
  const { cpf, nome, email, senha, termoUso } = dados;
  if (!cpf || !/^\d{11}$/.test(cpf) || !nome || !email || !senha || termoUso === undefined) {
    throw new Error("Dados de cadastro inválidos.");
  }
 
  const hashedSenha = await hashPassword(senha);
  return executeQuery("CALL postCadastraLogin(?, ?, ?, ?, ?)", [cpf, nome, email, hashedSenha, termoUso]);
};

export default cadastraLogin;