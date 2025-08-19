import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";
import { hashPassword } from "./services.js";



interface RecuperaSenhaInput {
  cpf: string;
  email: string;
  senha: string;
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


export const recuperaSenha = async (dados: RecuperaSenhaInput): Promise<any> => {
  const { cpf, email, senha } = dados;
  if (!cpf || !/^\d{11}$/.test(cpf) || !email) {
    throw new Error("CPF ou e-mail inválido.");
  }
  console.log('Dados para recuperação de senha:', dados);
  const hashedSenha = await hashPassword(senha);
  return executeQuery("CALL putRecuperaSenha(?, ?, ?)", [cpf, email, hashedSenha]);
};
/*import PoolMysql from "../dados/dados.js"
export const  recuperaSenha = (valores: any) => {
    console.log("PUT RECUPERA SENHA ", typeof(valores), valores);
    const [cpf,email, senha] = valores;    
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call putRecuperaSenha(?,?,?)",
            [cpf, email, senha],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    console.log("PUT RECUPERA SENHA error", error);
                    reject(error);
                } else {                 
                    resolve(results);

                }
            }
        );
    });
}
    */