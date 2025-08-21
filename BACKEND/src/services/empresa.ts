import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Empresa {
  idempresa: number;
  descempresa: string;
  desccidade: string;
  maps: string;
  logo: string;
}

interface EmpresaInput {
  idempresa: number;
  descempresa: string;
  desccidade: string;
  maps: string;
  logo: string;
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

export const getEmpresa = async (): Promise<Empresa[]> => {
  return executeQuery("SELECT * FROM empresa", []);
};

export const postEmpresa = async (dados: any[]): Promise<any> => {
  const [empresa] = dados;
  console.log("empresa no em  ", empresa);
  return executeQuery(
    "CALL postempresa(?, ?, ?, ?, ?)",
    [
      empresa.idempresa,
      empresa.descempresa,
      empresa.desccidade,
      empresa.maps,
      empresa.logo,
    ]
  );
};

export const delEmpresa = async (id: number): Promise<any> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID da empresa inválido.");
  }
  return executeQuery("CALL delempresa(?)", [id]);
};