import PoolMysql from "../dados/dados";
const getEmpresa= () =>{
    console.log("dentro da empresa");
    return new Promise((resolve, reject) => {
      PoolMysql.query(
        "select * from empresa",
        (error: any, results: unknown, fields: any) => {
          if (error) {
            reject(error);
          } else {
            // console.log("resultado empresa ", results);
            resolve(results);
          }
        }
      );
    });

}

const postEmpresa = (dados:any) => {
    return new Promise((resolve, reject) => {
        console.log("post empresa empresa ", dados);
        const  [idempresa, descempresa, desccidade, maps, logo] = dados;
        PoolMysql.query(
          "call postempresa(?,?,?,?,?)",
          [
           idempresa,
            descempresa,
            desccidade,
            maps,
            logo,
          ],
          (error: any, results: unknown) => {
            if (error) {
              console.error("Erro aqui Atualiza curriculo");
              //   getLog("error", JSON.stringify(error));
              reject(error);
            } else {
              console.log("resultado ", results);
              resolve(results);
              //   getLog("info", JSON.stringify(results));
              // logger.info(JSON.stringify(results)+' - '+ new Date().toLocaleString('pt-BR'))
            }
          }
        );
      });
}
const delEmpresa = (id: number) =>{
    console.log("dentro da empresa");
    return new Promise((resolve, reject) => {
      PoolMysql.query(
        "call delempresa(?)",[id],
        (error: any, results: unknown, fields: any) => {
          if (error) {
            reject(error);
          } else {
            console.log("resultado empresa ", results);
            resolve(results);
          }
        }
      );
    });
}
module.exports={
    getEmpresa,
    postEmpresa,
    delEmpresa
}
