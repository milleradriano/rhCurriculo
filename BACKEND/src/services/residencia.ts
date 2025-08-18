import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Residencia {
  idcandidato: number;
  cpf: string;
  cep: string;
  estado: string;
  cidade: string;
  endereco: string;
  bairro: string;
  numero: string;
}

interface ResidenciaInput {
  idcandidato: number;
  cpf: string;
  cep: string;
  estado: string;
  cidade: string;
  endereco: string;
  bairro: string;
  numero: string;
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

export const getResidencia = async (idcandidato: number, cpf: string): Promise<Residencia[]> => {
  if (!Number.isInteger(idcandidato) || idcandidato <= 0 || !cpf || !/^\d{11}$/.test(cpf)) {
    throw new Error("ID do candidato ou CPF inválido.");
  }
  return executeQuery("SELECT * FROM residencia WHERE idcandidato = ? AND cpf = ?", [idcandidato, cpf]);
};

export const postResidencia = async (dados: ResidenciaInput): Promise<{ status: string }> => {
  const { idcandidato, cpf, cep, estado, cidade, endereco, bairro, numero } = dados;
  const result = await executeQuery(
    "CALL postResidencia(?, ?, ?, ?, ?, ?, ?, ?)",
    [idcandidato, cpf, cep, estado, cidade, endereco, bairro, numero]
  );
  const status = result[0][0]?.status;
  if (status == "0" || status == "1") {
    return { status };
  }
  throw new Error("Resposta inválida do procedimento postResidencia.");
};

export const delResidencia = async (id: number): Promise<any> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID do candidato inválido.");
  }
  return executeQuery("CALL delResidencia(?)", [id]);
};