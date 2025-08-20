import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Candidato {
  idcandidato: number;
  cpf: string;
  nome: string;
  datanascimento: string;
  sexo: string;
  email: string;
  rg: string;
  orgaoemissorrg: string;
  estadorg: string;
  dataexpedicaorg: string;
  nomepai: string;
  nomemae: string;
  grauinstrucao: string;
  pcd: string;
  pcddeficiencia: string;
  estudaatualmente: string;
  turnoestuda: string;
  possuifilho: string;
  numFilhos: string;
  telefone: string;
  estadocivil: string;
}

interface CurriculoInput {
  idcandidato: number;
  cpf: string;
  nome: string;
  datanascimento: string;
  sexo: string;
  email: string;
  rg: string;
  orgaoemissorrg: string;
  estadorg: string;
  dataexpedicaorg: string;
  nomepai: string;
  nomemae: string;
  grauinstrucao: string;
  pcd: string;
  pcddeficiencia: string;
  estudaatualmente: string;
  turnoestuda: string;
  possuifilho: string;
  numFilhos: string;
  telefone: string;
  estadocivil: string;
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

export const getCurriculo = async (cpf: string): Promise<Candidato[]> => {
  if (!cpf || !/^\d{11}$/.test(cpf)) {
    throw new Error("CPF inválido.");
  }
  return executeQuery("SELECT * FROM candidato WHERE cpf = ?", [cpf]);
};

export const postCurriculo = async (dados: CurriculoInput): Promise<any> => {
  const {
    idcandidato,
    cpf,
    nome,
    datanascimento,
    sexo,
    email,
    rg,
    orgaoemissorrg,
    estadorg,
    dataexpedicaorg,
    nomepai,
    nomemae,
    grauinstrucao,
    pcd,
    pcddeficiencia,
    estudaatualmente,
    turnoestuda,
    possuifilho,
    numFilhos,
    telefone,
    estadocivil,
  } = dados;
console.log("Dados recebidos:", dados);
  return executeQuery(
    "CALL postcandidato(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      idcandidato,
      cpf,
      nome,
      datanascimento,
      sexo,
      email,
      rg,
      orgaoemissorrg,
      estadorg,
      dataexpedicaorg,
      nomepai,
      nomemae,
      grauinstrucao,
      pcd,
      pcddeficiencia,
      estudaatualmente,
      turnoestuda,
      possuifilho,
      numFilhos,
      telefone,
      estadocivil,
    ]
  );
};

export const deleteCurriculo = async (id: number): Promise<any> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID de candidato inválido.");
  }
  return executeQuery("CALL delcurriculo(?)", [id]);
};