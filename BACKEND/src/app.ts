import 'dotenv/config';
import express from "express";
import { Request, Response } from "express";


import multer from "multer";
import {promises as fs} from "fs"
import path from "path";
import cors from "cors";


const app = express();

import login from "./services/login.js";
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
import painelvaga from "./services/painelVaga.js";


import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from "./services/services.js";


app.use(cors({ origin: ["http://localhost:3000","http://localhost:4200"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cadastraLogin from './services/cadastraLogin.js';

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
// app.post("/cadastro-login", async (req: Request, res: Response) => {
//   console.log("cadastro-login", req.body);

//   const senha = await hashPassword(req.body.senha);

//   const valor = [
//     req.body.cpf.replace(/[^0-9]/g, ""),
//     req.body.nome,
//     req.body.email,
//     senha,
//     req.body.termoUso,
//   ];
 
  /*console.log("valor", valor);
  login.postCadastraLogin([valor]).then((result: any) => {
    res.send(result);
  });
});
*/
//**********************************************************************************/

//************************LOGIN USUARIO ***************************************/
app.post("/login",  async (req: Request, res: Response) => {
  
  const { cpf: rawCpf, senha } = req.body;
  if (!rawCpf || !senha) {
     res.status(400).json({ mensagem: "CPF e senha são obrigatórios." });
     return;
  }

  const cpf = rawCpf.replace(/\D/g, "");
  if (cpf.length !== 11) {
   res.status(400).json({ mensagem: "CPF inválido." });
     return;
  }

  try {
    const result : any = await login.postLogin([cpf]);

    if (!result) {
     res.status(401).json({ mensagem: "Usuário ou senha inválida." });
       return;
    }

    const usuario = result[0][0];

    if (usuario.SITUACAO === "B") {
     res.status(429).json({ mensagem: "Excesso de tentativas, tente mais tarde." });
       return;
    }

    const senhaValida = await verifyPassword(senha, usuario.SENHA);
    if (!senhaValida) {
     res.status(401).json({ mensagem: "Usuário ou senha inválida." });
       return;
    }

    const token = await generateToken( cpf );
   res.json({ token });
     return;

  } catch (error) {
    console.error("Erro no login:", error);
   res.status(503).json({ mensagem: "Serviço indisponível, tente mais tarde." });
     return;
  }
});


app.use("/curriculo", curriculoRouter);

app.get("/painelvaga", async (req: Request, res: Response) => {
  painelvaga.getPainelVaga().then((result: any) => {
    res.send(result);
  });
});

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
