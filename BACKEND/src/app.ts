import 'dotenv/config';
import express from "express";
const app = express();

import cors from "cors";

import loginRouter from "./routes/login.route.js";
import cadastraLoginRoute from "./routes/cadastraLogin.route.js";

import curriculoRouter  from "./routes/curriculo.route.js";

import arquivoLogoRouter from "./routes/arquivoLogo.route.js";
//* documentos para o candidato pcd
import uploadArquivoDocumento from "./routes/uploadArquivoDocumento.route.js";
import arquivoDocumentoRouter from "./routes/arquivoDocumento.route.js";
//* documentos para o candidato pcd
                                                   
import vagaRouter from "./routes/vaga.route.js";
import cepRouter from "./routes/cep.route.js";
import empresaRouter from "./routes/empresa.route.js";
import residenciaRouter from "./routes/residencia.route.js";

import experienciaRouter from "./routes/experiencia.route.js";

import alteraSenhaRouter from "./routes/alteraSenha.route.js";
import recuperaSenhaRouter from "./routes/recuperaSenha.route.js";
import painelVagaRoute from "./routes/painelVaga.route.js";




app.use(cors({ origin: ["http://localhost:3000","http://localhost:4200","http://192.168.0.106:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/cadastro-login",cadastraLoginRoute)

app.use("/login", loginRouter);

app.use("/curriculo", curriculoRouter);

app.use("/painelvaga", painelVagaRoute)

app.use("/vaga", vagaRouter);

app.use("/empresa",empresaRouter)

app.use("/cep", cepRouter)

app.use("/residencia", residenciaRouter);

//*********************************** FIM DOCUMENTOS *****/
// RETORNA O NOME DO DOCUMENTO
app.use("/documento",arquivoDocumentoRouter );
app.use("/uploaddocumento", uploadArquivoDocumento)
/*********************************** */

//RETORNA O LOGO da loja
 app.use("/logo", arquivoLogoRouter);
//************************************/

app.use("/experiencia", experienciaRouter);

app.use("/recupera-senha",recuperaSenhaRouter);

app.use("/altera-senha",alteraSenhaRouter);

export default app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sevidor rodando na porta ${PORT}`);
});
