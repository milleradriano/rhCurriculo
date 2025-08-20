import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface LoginInput {
  cpf: string;
}

const executeQuery = (query: string, params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    PoolMysql.query(query, params, (error, results) => {
      if (error) {
        reject(new Error("Erro ao acessar o banco de dados."));
      } else {
        resolve(results);
      }
    });
  });
};

export const postLogin = async ({ cpf }: LoginInput): Promise<any> => {
  return executeQuery("CALL postLogin(?)", [cpf]);
};