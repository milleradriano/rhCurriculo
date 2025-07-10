import  PoolMysql  from "../dados/dados";


//**** USADO NO MODULO ESQUECI SENHA  */
const  putRecuperaSenha = (valores: any) => {
    console.log("PUT RECUPERA SENHA ", typeof(valores), valores);
    const [cpf,email, senha] = valores;    
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call putRecuperaSenha(?,?,?)",
            [cpf, email, senha],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    console.log("PUT RECUPERA SENHA error", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
//****************************************************************/

const putAlteraSenha = (valores: any) => {
    console.log("PUT ALTERA SENHA NA ROTA", typeof(valores), valores);
    const [codcli,cpf, senha] = valores;    
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call putAlteraSenha(?,?,?)",
            [codcli, cpf, senha],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    console.log("PUT ALTERA SENHA error", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
//****************************************************************/


export {putAlteraSenha, putRecuperaSenha };