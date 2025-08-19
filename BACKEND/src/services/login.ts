import PoolMysql from "../dados/dados.js";


export const  postLogin = (valores: any) => {
    const  cpf = valores;
     console.log("CPF valores no postLogin ", cpf);
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call postlogin(?)",
            [cpf],
           // [valores.cpf.replace(/\D/g, "")],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    //   getLog("error", JSON.stringify(error));
                    console.log("POST LOGIN error", error);
                    reject(error);
                } else {                 
                    resolve(results);
                }
            }
        );      
    })
}


export default postLogin;