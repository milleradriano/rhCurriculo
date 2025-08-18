import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Vaga {
  idvaga: number;
  nomeVaga: string;
  status: string;
  descVaga: string;
  idEmpresa: number;
  escolaridade: string;
  experiencia: string;
  infoContrato: string;
  regimeContrato: string;
  beneficio: string;
  requisito: string;
  horario: string;
  observacao: string;
  usuario: string;
}

interface VagaCandidato {
  idvaga: number;
  idcandidato: number;
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

export const getVaga = async (): Promise<Vaga[]> => {
  return executeQuery("SELECT * FROM vaga", []);
};

export const postVaga = async (dados: any[]): Promise<any> => {
  const [vaga] = dados;
  return executeQuery(
    "CALL postvaga(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      vaga.idVaga || null,
      vaga.nomeVaga,
      vaga.status,
      vaga.descVaga,
      vaga.idEmpresa,
      vaga.escolaridade,
      vaga.experiencia,
      vaga.infoContrato,
      vaga.regimeContrato,
      vaga.beneficio,
      vaga.requisito,
      vaga.horario,
      vaga.observacao,
      "adriano", // Usuário fixo, ajuste conforme necessário
    ]
  );
};

export const deleteVaga = async (id: number): Promise<any> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID da vaga inválido.");
  }
  return executeQuery("CALL deleteVaga(?)", [id]);
};

export const getVagaId = async (id: number): Promise<Vaga> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID da vaga inválido.");
  }
  const result = await executeQuery("SELECT * FROM vw_vaga WHERE idvaga = ?", [id]);
  if (!result.length) {
    throw new Error("Vaga não encontrada.");
  }
  return result[0];
};

export const postVagaCandidato = async (dados: [number, number]): Promise<any> => {
  const [idvaga, idcandidato] = dados;
  if (!Number.isInteger(idvaga) || idvaga <= 0 || !Number.isInteger(idcandidato) || idcandidato <= 0) {
    throw new Error("ID da vaga ou candidato inválido.");
  }
  return executeQuery("CALL postvagacandidato(?, ?)", [idvaga, idcandidato]);
};

export const delVagaCandidato = async (idvaga: number, idcandidato: number): Promise<any> => {
  if (!Number.isInteger(idvaga) || idvaga <= 0 || !Number.isInteger(idcandidato) || idcandidato <= 0) {
    throw new Error("ID da vaga ou candidato inválido.");
  }
  return executeQuery("CALL delVagaCandidato(?, ?)", [idvaga, idcandidato]);
};