 import PoolMysql from "../dados/dados";
const getCurriculo = () => {
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "select * from curriculo",
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

const postcurriculo = (valores: any) => {
 
  const [
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
     estadocivil
    // primeiroemprego,
    // ultimoempregoempresa,
    // ultimoempregocidade,
    // ultimoempregocargo,
    // ultimoempregoinicio,
    // ultimoempregoatribuicao,
    // penultimoempregoempresa,
    // penultimoempregocidade,
    // penultimoempregocargo,
    // penultimoempregoinicio,
    // penultimoempregoatribuicao
  ] = valores;
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call postcurriculo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
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
         estadocivil
        // primeiroemprego,
        // ultimoempregoempresa,
        // ultimoempregocidade,
        // ultimoempregocargo,
        // ultimoempregoinicio,
        // ultimoempregoatribuicao,
        // penultimoempregoempresa,
        // penultimoempregocidade,
        // penultimoempregocargo,
        // penultimoempregoinicio,
        // penultimoempregoatribuicao
      ],
      (error: any, results: unknown) => {
        if (error) {
          console.error("Erro aqui Atualiza curriculo");
          //   getLog("error", JSON.stringify(error));
          reject(error);
        } else {
          console.log("resultado curriculo 91 ", results);
          resolve(results);
          //   getLog("info", JSON.stringify(results));
          // logger.info(JSON.stringify(results)+' - '+ new Date().toLocaleString('pt-BR'))
        }
      }
    );
  });
};

const delcurriculo = (id: number) => {
  return new Promise((resolve, reject) => {
    console.log("id ", id);
    PoolMysql.query(
      "call delcurriculo(?)",
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
  getCurriculo,
  postcurriculo,
  delcurriculo,
};
