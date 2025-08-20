import { Pool } from "mysql2/promise";
import PoolMysql from "../dados/dados.js";

interface Vaga {
  id?: number;
  titulo?: string;
  descricao?: string;
  [key: string]: any; // Flexível para outros campos da view
}

const executeQuery = (query: string, params: any[] = []): Promise<any> => {
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

export const getPainelVaga = async (): Promise<Vaga[]> => {
  return executeQuery("SELECT * FROM vw_painelVaga");
};
// import PoolMysql from "../dados/dados.js";

// const getPainelVaga = () => {
//   return new Promise((resolve, reject) => {
//     PoolMysql.query("select * from vw_painelVaga", (error: any, results: any) => {
//       if (error) {
//         console.error("Erro ao obter painel de vagas:", error);
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

// export default {
//   getPainelVaga,
// };
