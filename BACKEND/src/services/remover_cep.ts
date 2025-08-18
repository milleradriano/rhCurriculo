import 'dotenv/config';
const URL_CEP = process.env.URL_CEP;
import axios from "axios";

const getCep = async (cep: string): Promise<any> => {
  try {
    console.log('ceo ',cep)
    const response = await axios.get(`${URL_CEP}/${cep}/json/`);
    return response.data; // Retorna os dados do CEP.
  } catch (error: any) {
    console.error("Erro ao buscar CEP:", error.message);
    throw new Error(`Erro ao buscar CEP: ${error.message}`);
  }
};



// const getCep = (cep: any) => {

//       return new Promise((resolve, reject) => {
//         fetch(`${URL_CEP}/${cep}/json/`)
//           .then((response) => response.json())
//           .then((json) => resolve(json))
//           .catch((error) => reject("Erro no reject "+error.code),
        
//         ),
//           (error: any, results: unknown, fields: any) => {
//             if (error) {
//               console.log("erro no catch",error)
//             //   getLog("error-cadastro Empresa", JSON.stringify(error));

//               reject(error);
//             } else {
//             //   getLog("info - cadastro Empresa", JSON.stringify(results));
//               resolve(results);
//             }
//           }
//   });
// };
export default { getCep};
