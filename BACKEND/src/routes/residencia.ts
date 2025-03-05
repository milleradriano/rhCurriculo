import PoolMysql from "../dados/dados";
const getResidencia = () => {
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "select * from curriculo", //#TODO Criar um call residencia
      (error: any, results: unknown, fields: any) => {
        if (error) {
          //   getLog("error-cadastro Empresa", JSON.stringify(error));
          reject(error);
        } else {
          //   getLog("info - cadastro Empresa", JSON.stringify(results));
          console.log("resultado ", results);
          resolve(results);
        }
      }
    );
  });
};

const postResidencia = (valores: any) => {
 
  const [
    cpf, 
    primeiroemprego,
    ultimoempregoempresa,
    ultimoempregocidade,
    ultimoempregocargo,
    ultimoempregoinicio,
    ultimoempregoatribuicao,
    penultimoempregoempresa,
    penultimoempregocidade,
    penultimoempregocargo,
    penultimoempregoinicio,
    penultimoempregoatribuicao
  ] = valores;
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call postResidencia(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        cpf,     
        primeiroemprego,
        ultimoempregoempresa,
        ultimoempregocidade,
        ultimoempregocargo,
        ultimoempregoinicio,
        ultimoempregoatribuicao,
        penultimoempregoempresa,
        penultimoempregocidade,
        penultimoempregocargo,
        penultimoempregoinicio,
        penultimoempregoatribuicao
      ],
      (error: any, results: unknown) => {
        if (error) {
          console.error("Erro aqui Atualiza Residencia");
          //   getLog("error", JSON.stringify(error));
          reject(error);
        } else {
          console.log("resultado Residencia 91 ", results);
          resolve(results);
          //   getLog("info", JSON.stringify(results));
          // logger.info(JSON.stringify(results)+' - '+ new Date().toLocaleString('pt-BR'))
        }
      }
    );
  });
};

const delResidencia = (id: number) => {
  return new Promise((resolve, reject) => {
    console.log("id ", id);
    PoolMysql.query(
      "call delResidencia(?)",
      [id],
      (error: any, results: unknown, fields: any) => {
        if (error) {
          //   getLog("error", JSON.stringify(error));
          reject(error);
        } else {
          //   getLog("info", JSON.stringify(results));
          resolve(results);
        }
      }
    );
  });
};
module.exports = {
  getResidencia,
  postResidencia,
  delResidencia,
};
