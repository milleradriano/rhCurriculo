import PoolMysql from "../dados/dados";


const getDocumento = (idcandidato: number,cpf:string) => {
  console.log("getDocumento idcandidato ", idcandidato, " cpf ", cpf);
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call getDocumento(?,?)",
      [idcandidato,cpf  ],
      (error: any, results: unknown) => {
        if (error) {
          console.error("Erro aqui getDocumento", error);
          reject(error);
        } else {
          
          resolve(results);
          console.log("REGISTRO SALVO ");
          console.log("----------------------------------------------------------");
        }
      }
    );
  });
};

const postDocumento = (valores: any) => {
  console.log("Valores postDocumento documentos.ts 26 ", valores);

  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call postDocumento(?,?,?)",
      [valores.idcandidato,valores.cpf, valores.documento],
      (error: any, results: unknown) => {
        if (error) {
          console.error("Erro aqui Atualiza Documento", error);
          reject(error);
        } else {
          console.log("resultado Documento ", results);
        }
      }
    );
});
};

const deleteDocumento = (idcandidato: number, iddocumento: number,nome: string) => {
  console.log("idcandidato ", idcandidato, " iddocumento ", iddocumento, " nome ", nome);
  return new Promise((resolve, reject) => {
    PoolMysql.query(
      "call delDocumento(?,?,?)",
      [idcandidato, iddocumento,nome],
      (error: any, results: unknown) => {
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

export { getDocumento, deleteDocumento, postDocumento };
