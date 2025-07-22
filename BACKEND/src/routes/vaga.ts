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
          console.log("get vaga.ts 11", results);
          resolve(results);
        }
      }
    );
  });
};
const postVaga = (valores: any) => {
  console.log("Valores postVaga vaga.ts ", valores);
 
  return new Promise ((resolve, reject) => {
    PoolMysql.query(
      "call postvaga(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [ valores[0].idVaga || null,
        valores[0].nomeVaga,      
        valores[0].status,
        valores[0].descVaga,
        valores[0].idEmpresa,
        valores[0].escolaridade,
        valores[0].experiencia,
        valores[0].tipoContrato,
        valores[0].beneficio,
        valores[0].requisito,
        valores[0].horario,
        valores[0].observacao,
        'adriano'
      ],
      (error: any, results: unknown, fields: any) => {
        if (error) {
          console.log("POST VAGA error", error);
          reject(error);
        } else {         
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
