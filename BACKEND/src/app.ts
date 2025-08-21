import 'dotenv/config';
import express from "express";
import { Request, Response } from "express";


import multer from "multer";
import {promises as fs} from "fs"
import path from "path";
import cors from "cors";


const app = express();

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




app.use(cors({ origin: ["http://localhost:3000","http://localhost:4200"], credentials: true }));
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
