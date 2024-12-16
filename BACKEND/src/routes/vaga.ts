import  PoolMysql  from "../dados/dados";
const getVaga = () => {
  console.log("dentro da vaga");
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "select * from vaga",
      (error: any, results: unknown, fields: any) => {
        if (error) {
          reject(error);
        } else {
          console.log("resultado vaga ", results);
          resolve(results);
        }
      }
    );
  });
};
const postVaga = (valores: any) => {
  const [
    idvaga,
    idempresa,
    idcidade,
    pagamento,
    descvaga,
    atividade,
    status,
    requsito,
    nomevaga,
    informacaocontrato,
    beneficio,
    horario,
    observacaohorario
  ] = valores;
  console.log("Dentro do post vaga ", valores);
  return new Promise ((resolve, reject) => {
    PoolMysql.query(
      "call postvaga(?,?,?,?,?,?,?,?,?,?,?,?)",
      [ idvaga,
        idempresa,
        idcidade,
        pagamento,
        descvaga,
        atividade,
        status,
        requsito,
        nomevaga,
        informacaocontrato,
        beneficio,
        horario,
        observacaohorario
      ],
      (error: any, results: unknown, fields: any) => {
        if (error) {
          reject(error);
        } else {
          console.log("resultado vaga ", results);
          resolve(results);
        }
      }
    );
  });
};

module.exports = {
  getVaga,
  postVaga,
};
