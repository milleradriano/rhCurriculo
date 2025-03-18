import PoolMysql from "../dados/dados";


const postLogin = (valores: any) => {
    const [ cpf, senha] = valores;
    return new Promise((resolve, reject) => {
        PoolMysql.query(
            "call postconsultalogin(?,?)",[cpf,senha],
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
}
module.exports = {postLogin};