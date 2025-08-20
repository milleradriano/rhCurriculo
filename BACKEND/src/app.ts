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
import uploadArquivoDocumento from "./routes/uploadArquivoDocumento.route.js";
                                                   
import vagaRouter from "./routes/vaga.route.js";
import cepRouter from "./routes/cep.route.js";
import empresaRouter from "./routes/empresa.route.js";
import residenciaRouter from "./routes/residencia.route.js";

import experienciaRouter from "./routes/experiencia.route.js";
import arquivoDocumentoRouter from "./routes/arquivoDocumento.route.js";

import alteraSenhaRouter from "./routes/alteraSenha.route.js";
import recuperaSenhaRouter from "./routes/recuperaSenha.route.js";
import painelVagaRoute from "./routes/painelVaga.route.js";




app.use(cors({ origin: ["http://localhost:3000","http://localhost:4200"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/************************* UPLOAD DO ARMAZENAMENTO DO LOGO ****************************************/
const storageLogo = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./src/images/logo");
  },
  filename: function (req: any, file: any, cb: any) {
    console.log("filename", file);
    cb(null, file.originalname);
  },
});
const uploadLogo = multer({
  storage: storageLogo,
  // Verifique se o campo no frontend é 'logo'
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});
/************************* FIMM UPLOAD DO ARMAZENAMENTO DO LOGO ****************************************/

app.use("/cadastro-login",cadastraLoginRoute)

app.use("/login", loginRouter);

app.use("/curriculo", curriculoRouter);

app.use("/painelvaga", painelVagaRoute)

app.use("/vaga", vagaRouter);

app.use("/empresa",empresaRouter)

app.use("/cep", cepRouter)

app.use("/residencia", residenciaRouter);

app.use("/uploaddocumento", uploadArquivoDocumento)
 
//*********************************** FIM DOCUMENTOS *****/
// RETORNA O NOME DO DOCUMENTO
 app.use("/documento",arquivoDocumentoRouter );


app.post("/uploadlogo", uploadLogo.single("logo"),  async (req: any, res: any) => {
    if (!req.file) {
      console.log("req file ", req.file);
      return res.status(400).send({ error: "Nenhum arquivo enviado" });
    } else {
      console.log("req file ", req.file);
      res.send(req.file);
      return;
    }
  }
);
app.use("/logo", express.static(path.join(__dirname, "/images/logo")));



app.use("/experiencia", experienciaRouter);

app.use("/recupera-senha",recuperaSenhaRouter);

app.use("/altera-senha",alteraSenhaRouter);

export default app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sevidor rodando na porta ${PORT}`);
});
