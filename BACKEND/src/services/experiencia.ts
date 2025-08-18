import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Experiencia {
  idcandidato: number;
  cpf: string;
  primeiroEmprego: string;
  empresa: string;
  cidade: string;
  cargo: string;
}

interface ExperienciaInput {
  idcandidato: number;
  cpf: string;
  primeiroEmprego: string;
  empresa: string;
  cidade: string;
  cargo: string;
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

export const getExperiencia = async (idcandidato: number, cpf: string): Promise<Experiencia[]> => {
  if (!Number.isInteger(idcandidato) || idcandidato <= 0 || !cpf || !/^\d{11}$/.test(cpf)) {
    throw new Error("ID do candidato ou CPF inválido.");
  }
  return executeQuery("CALL getExperiencia(?, ?)", [idcandidato, cpf]);
};

export const postExperiencia = async (dados: ExperienciaInput): Promise<any> => {
  const { idcandidato, cpf, primeiroEmprego, empresa, cidade, cargo } = dados;
  const valores = {
    idcandidato,
    cpf,
    primeiroEmprego,
    empresa: primeiroEmprego === "S" ? "" : empresa,
    cidade: primeiroEmprego === "S" ? "" : cidade,
    cargo: primeiroEmprego === "S" ? "" : cargo,
  };
  return executeQuery(
    "CALL postExperiencia(?, ?, ?, ?, ?, ?)",
    [valores.idcandidato, valores.cpf, valores.primeiroEmprego, valores.empresa, valores.cidade, valores.cargo]
  );
};