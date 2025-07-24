import PoolMysql from "../dados/dados";

const getPainelVaga = () => {
  return new Promise((resolve, reject) => {
    PoolMysql.query("select * from vw_painelVaga", (error: any, results: any) => {
      if (error) {
        console.error("Erro ao obter painel de vagas:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getPainelVaga,
};
