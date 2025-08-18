import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Documento {
  idcandidato: number;
  cpf: string;
  documento: string;
  iddocumento: number;
  nome: string;
}

interface DocumentoInput {
  idcandidato: number;
  cpf: string;
  documento: string;
}

interface DocumentoDelete {
  idcandidato: number;
  cpf: string;
  nome: string;
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

export const getDocumento = async (idcandidato: number, cpf: string): Promise<Documento[]> => {
  if (!Number.isInteger(idcandidato) || idcandidato <= 0 || !cpf || !/^\d{11}$/.test(cpf)) {
    throw new Error("ID do candidato ou CPF inválido.");
  }
  
  return executeQuery("CALL getDocumento(?, ?)", [idcandidato, cpf]);
};

export const postDocumento = async (dados: DocumentoInput): Promise<any> => {
  const { idcandidato, cpf, documento } = dados;
  return executeQuery("CALL postDocumento(?, ?, ?)", [idcandidato, cpf, documento]);
};

export const deleteDocumento = async (dados: DocumentoDelete): Promise<any> => {
  const { idcandidato, cpf, nome } = dados;
  console.log("Deletando documento:", idcandidato, cpf, nome);
  if (!Number.isInteger(idcandidato) || idcandidato <= 0 || !/^\d{11}$/.test(cpf)) {
    throw new Error("ID do candidato ou CPF inválido.");
  }
  return executeQuery("CALL delDocumento(?, ?, ?)", [idcandidato, cpf, nome]);
};