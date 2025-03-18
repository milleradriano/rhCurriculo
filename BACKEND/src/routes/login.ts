import PoolMysql from "../dados/dados";

const postCadastraLogin =(valores: any) => {
const  [
    cpf,
    nome,
    email, 
    senha,
    termo] = valores;
    console.log("valores", valores);
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call postcadastralogin(?,?,?,?,?)",
            [cpf,nome, email, senha, termo],
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
    })
}


const  postLogin = (valores: any) => {
    const  cpf = valores;
    // console.log("CPF valores no postLogin ", cpf);
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call postlogin(?)",
            [cpf],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    //   getLog("error", JSON.stringify(error));
                    console.log("POST LOGIN error", error);
                    reject(error);
                } else {
                    //  console.log("POST LOGIN results", results);
                    resolve(results);
                }
            }
        );      
    })
}
          
export { postCadastraLogin, postLogin};