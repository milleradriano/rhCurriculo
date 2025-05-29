import PoolMysql from "../dados/dados";
const getCurriculo = (valores: any) => {
  console.log("inicio da curriculo ", valores);
  if (!valores) {
    console.log("getCurriculo sem cpf");
    return Promise.reject(new Error("CPF não informado")); // Retorna uma Promise rejeitada
  }

  const cpf = valores;

  console.log("CPF recebido:", cpf);
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "select * from candidato where cpf = ? ",
      [cpf],
      (error: any, results: unknown, fields: any) => {
        if (error) {
          //   getLog("error-cadastro Empresa", JSON.stringify(error));
          console.log("resultado erro ", results);
          reject(error);
        } else {
          //   getLog("info - cadastro Empresa", JSON.stringify(results));
      //    console.log("resultado ", results);
          resolve(results);
        }
      }
    );
  });
};

const postcurriculo = (valores: any) => {
 
  const [
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
    
  ] = valores;
  
  console.log(
    "Valores postcurriculo FIMMM ",valores)
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call postcandidato(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
