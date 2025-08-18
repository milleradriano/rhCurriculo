import 'dotenv/config';
import express from "express";
import { Request, Response } from "express";


import multer from "multer";
import {promises as fs} from "fs"
import path from "path";
import cors from "cors";


const app = express();
import curriculoRouter  from "./routes/curriculo.route.js";
import uploadArquivoDocumento from "./routes/uploadArquivoDocumento.route.js";
                                                   
import vagaRouter from "./routes/vaga.route.js";
import cepRouter from "./routes/cep.route.js";
import empresaRouter from "./routes/empresa.route.js";
import residenciaRouter from "./routes/residencia.route.js";


import login from "./services/login.js";
import experienciaRouter from "./routes/experiencia.route.js";
import arquivoDocumentoRouter from "./routes/arquivoDocumento.route.js";
import email from "./services/email.js";
import alteraSenha from "./services/alteraSenha.js";
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
/*############################# UPLOAD DO ARMAZENAMENTO DO DOCUMENTO #################################*/

/*#############################  FIMMM UPLOAD DO ARMAZENAMENTO DO DOCUMENTO #################################*/

app.post("/cadastro-login", async (req: Request, res: Response) => {
  console.log("cadastro-login", req.body);

  const senha = await hashPassword(req.body.senha);

  const valor = [
    req.body.cpf.replace(/[^0-9]/g, ""),
    req.body.nome,
    req.body.email,
    senha,
    req.body.termoUso,
  ];
 
  console.log("valor", valor);
  login.postCadastraLogin([valor]).then((result: any) => {
    res.send(result);
  });
});

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

//***********************  INICIO CURRICULO                   *************************/
app.use("/curriculo", curriculoRouter);
/**********************FIM CURRICULO ******************************/

//*********************PAINEL VAGA**********************************/
app.get("/painelvaga", async (req: Request, res: Response) => {
  painelvaga.getPainelVaga().then((result: any) => {
    res.send(result);
  });
});
//*********************FIM PAINEL VAGA***************************** */

//*************************INICIO VAGAS ***********************/
app.use("/vaga", vagaRouter);
//************************ FIM VAGAS  *************************/

//********************* INICIO EMPRESA *************************/
app.use("/empresa",empresaRouter)

//************************** FIM EMPRESA *************************/

//*************************INICIO CEP  *************************/
app.use("/cep", cepRouter)
//************************** FIM CEP **************************/
//**************************INICIA RESIDENCIA*********************/
app.use("/residencia", residenciaRouter);
//**************************FIM RESIDENCIA*************************/

/********************** INICIO LOGO ************************/

//  app.use("/documento",documentoRouter, express.static(path.join(__dirname, "/images/docs")));
app.use("/uploaddocumento", uploadArquivoDocumento)
            // , express.static(path.join(__dirname, "/images/docs")));
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

/*********************INICIO  DOCUMENTOS***********************/

// app.get(
//   "/documento/",
//   verifyToken,
//   async (req: Request, res: Response): Promise<void> => {
//     console.log("get documento 101", req.query.idcandidato, " - ", req.query.cpf);
//     const idcandidatoRaw = req.query.idcandidato;
//     const cpfRaw : any = req.query.cpf;

//     if (!idcandidatoRaw || !cpfRaw) {
//       res.status(400).send({ error: "ID Candidato e CPF são obrigatórios." });
//       return;
//     }

//     const idcandidato = Number(Array.isArray(idcandidatoRaw) ? idcandidatoRaw[0] : idcandidatoRaw);
//     if (isNaN(idcandidato)) {
//       res.status(400).send({ error: "ID Candidato inválido." });
//       return;
//     }

//     const result = await documento.getDocumento(
//       idcandidato,
//       cpfRaw
//     );
//     res.send(result);
//   }
// );

// app.post(
//   "/uploaddocumento",
//   uploadDocumento.single("documento"),
//   verifyToken,
//   async (req: any, res: any) => {
//     console.log("no uploadDocumento 418 ", uploadDocumento.single("documento"));
//     if (!req.file) {
//       console.log("req file no ! ", req.file);
//       return res.status(400).send({ error: "Nenhum arquivo enviado" });
//     } else {
//       let nomeArquivo = Buffer.from(req.file.originalname, "binary").toString(
//         "utf-8"
//       );
//       console.log("nome do arquivo  424", nomeArquivo);
//       res.send(req.file);
//       const valores = {
//         idcandidato: req.body.idcandidato,
//         cpf: req.body.cpf,
//         documento: nomeArquivo,
//       };
//       documento.postDocumento(valores).then((result: any) => {
//         res.send(result);
//       });
//       return;
//     }
//   }
// );

// app.delete(
//   "/documento/:idcandidato/:cpf/:nome",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     const { idcandidato, cpf, nome } = req.params;
//     console.log("delete documento ", idcandidato, cpf, nome);
//     const idcandidatoNum = Number(idcandidato);
//     if (isNaN(idcandidatoNum)) {
//       res.status(400).send({ error: "ID Candidato inválido." });
//       return;
//     }
//     const cpfNum = Number(cpf);
//     if (isNaN(cpfNum)) {
//       res.status(400).send({ error: "CPF inválido." });
//       return;
//     }
//     const result = await documento.deleteDocumento(
//       idcandidatoNum,
//       cpfNum,
//       nome
//     );

//     const val = await apagaDocumentoStorage(idcandidato, nome);
//     if (val.error) {
//       console.error("Erro ao deletar arquivo:", val.error);
//       res.status(500).send({ error: "Erro ao deletar arquivo." });
//     } else {
//       console.log("Arquivo deletado com sucesso:", val.message);
//       res.send(result);
//     }
//   }
// );


/********************** INICIO EXPERIECIA *************************/
app.use("/experiencia", experienciaRouter);
//************************FIM EXPERIENCIA***************************/

//*************************INICIO EMAIL / ALTERA SENHA ****************************/


app.post("/recuperar-senha",  async (req: Request, res: Response) => {
  try {
    const valores = req.body;
    let novaSenha = Math.random().toString(36).slice(-6);
    console.log("novaSenha", novaSenha);
    let novaSenhaHash = await hashPassword(novaSenha);
    //ENVIA PARA O BANCO
    alteraSenha.putRecuperaSenha([  valores.cpf.replace(/[^0-9]/g, ""),valores.email,novaSenhaHash,]).then(
      (result: any) => {
        if (result.affectedRows === 1) {
          //ENVIAR EMAIL
          const envio = email.postMail(valores, novaSenha).then((result: any) => {
              console.log("email enviado", result);
              console.log("-------------------------------------------");
              if (envio) {
                console.error("Erro ao enviar e-mail 523:", envio);
              }
              res.send(result.responseCode);
            })
            .catch((error: any) => {
              console.error("Erro ao enviar e-mail 528:", error);
              res.status(500).send({ error: "Erro ao enviar e-mail. 529" });
            });
        }
        res.send({ mensagem: "recebido" });
      });
  } catch (error) {
    console.error("Erro ao enviar e-mail:535", error);
    res.status(500).send({ error: "Erro ao enviar e-mail.536 " });
  }
});

app.post("/altera-senha",verifyToken, async (req: Request, res: Response) => {

  try {    
    let valores = req.body;
if (valores.novaSenha.length < 6) {
      res.status(400).send({ error: "A senha deve ter pelo menos 6 caracteres" });
      return;
    } 
if (valores.novaSenha !== valores.confirmaSenha) {
      console.log("compara senha", valores.novaSenha, valores.confirmaSenha);
      res.status(400).send({ error: "As senhas devem sem iguais." });
      return;
    }
 
     let novaSenhaHash = await hashPassword(valores.novaSenha);     
     valores = [valores.idcandidato, valores.cpf.replace(/[^0-9]/g, ""),novaSenhaHash];
     console.log("valores do altera senha NO APP",  req.body);
     const result = await alteraSenha.putAlteraSenha(valores);
     res.send(result);
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).send({ error: "Erro ao alterar senha." });
  }
 });
//************************FIM  EMAIL / ALTERA SENHA **************************** */

//************************ INICIO VAGA CANDIDATOS ************************ */

// app.post("/vaga-candidato", async (req: Request, res: Response) => {
//   console.log("post vaga candidato no app ", req.body.idvaga);
//   const valores = [req.body.idvaga, req.body.idcandidato];
//   console.log("valores post vaga candidato ", valores);
//    vaga.postVagaCandidato(valores).then((result: any) => {
//      res.send(result);
//   });
// });
//************************ FIM VAGA CANDIDATOS ************************ */
export default app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sevidor rodando na porta ${PORT}`);
});
