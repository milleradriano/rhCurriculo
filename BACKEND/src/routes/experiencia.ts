import PoolMysql from "../dados/dados";
const getExperiencia = async (req: any, res: any) => {
    console.log("Valores getExperiencia 1 ", req.idcandidato, req.cpf);
    return new Promise(async (resolve, reject) => {
        PoolMysql.query(
            "call getExperiencia(?,?)",
            [req.idcandidato, req.cpf],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const postExperiencia = (req: any) => {
    const valores = req;
    if ( valores.primeiroEmprego === 'S' ) {
        valores.empresa = '';
        valores.cidade = '';
        valores.cargo = '';    
        console.log("Valores postExperiencia vai depois ", valores.idcandidato,valores.cpf,valores.primeiroEmprego, valores.empresa,valores.cidade, valores.cargo);         
    }
    console.log("Valores postExperiencia vai antes ", valores.idcandidato,valores.cpf,valores.primeiroEmprego, valores.empresa,valores.cidade, valores.cargo); 
    
    return new Promise(async (resolve, reject) => {
        PoolMysql.query(
            "call postExperiencia(?, ?, ?, ?, ?,?)",
            [valores.idcandidato,valores.cpf,valores.primeiroEmprego, valores.empresa,valores.cidade, valores.cargo],
            (error: any, results: unknown, fields: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
    
};

module.exports = {
    getExperiencia,
    postExperiencia,
};