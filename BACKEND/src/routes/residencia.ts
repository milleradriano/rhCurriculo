import PoolMysql from "../dados/dados";
const getResidencia = (valores: any) => {
  const idcandidato = valores.idcandidato;
  const cpf = valores.cpf;
  console.log("Valores getResidencia res.ts ", idcandidato, cpf);
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "select * from residencia where idcandidato = ? and cpf = ?",
      [idcandidato, cpf],
      //#TODO Criar um call residencia
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
  // const [idcandidato, cpf, cep, cidade, bairro, endereco, estado, numero] = valores;

  const [idcandidato, cpf, cep, estado, cidade, endereco, bairro, numero] =
    valores;
  console.log("Valores postResidencia ", valores);
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call postResidencia(?,?,?,?,?,?,?,?)",
      [idcandidato, cpf, cep, estado, cidade, endereco, bairro, numero],
      (error: any, results: unknown) => {
        if (error) {
          console.error("Erro aqui Atualiza Residencia", error);
          reject(error);
        } else {
          console.log(
            "resultado Residencia 91 ",
            JSON.parse(JSON.stringify(results))[0][0].status
          );
          if (JSON.parse(JSON.stringify(results))[0][0].status == 0) {
            /* ATUALIZADO RESIDENCIA */
            resolve({ status: "0" });
          } else if (JSON.parse(JSON.stringify(results))[0][0].status == 1) {
            /* NAO ATUALIZADO RESIDENCIA */
            resolve({ status: "1" });
          }
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
