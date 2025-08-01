require("dotenv").config();
import express from "express";
import { Request, Response } from "express";

const bodyParser = require("body-parser");
import multer from "multer";
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SECRET = process.env.API_key;

const app = express();
//const curriculo = require("./routes/curriculo");
const curriculo = require("./routes/curriculo");
const cep = require("./routes/cep");
const vaga = require("./routes/vaga");
const empresa = require("./routes/empresa");
const residencia = require("./routes/residencia");
const login = require("./routes/login");
const experiencia = require("./routes/experiencia");
const documento = require("./routes/documento");
const email = require("./routes/email");
const alteraSenha = require("./routes/alteraSenha");
const painelvaga = require("./routes/painelVaga");
//const  postLogin  = require("./routes/cadastraLogin");
//const login = require("./routes/login");
const bcrypt = require("bcrypt"); // para criptografar a senha

const {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} = require("./services/services");

import { toFormData } from "axios";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json; charset=utf-8" }));

// app.get("/", (request: any, response: any) => {
//   return response.send("Hello!");
// });

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
const storageDocumento = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadDirDocumento = "./src/images/docs/";
    uploadDirDocumento += req.body.idcandidato;
    console.log("Diretório de upload do documento:", uploadDirDocumento);
    try {
      await fs.access(uploadDirDocumento); // Verifica se o diretório existe
    } catch {
      await fs.mkdir(uploadDirDocumento, { recursive: true }); // Cria o diretório se não existir
    }
    cb(null, uploadDirDocumento);
  },
  filename: async (req, file, cb) => {
    let baseName = file.originalname; // Nome original
    const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let newFileName = nameWithoutExt + ext; // Preserva o nome original
    let filePath = path.join(
      "./src/images/docs",
      req.body.idcandidato,
      newFileName
    );
    let counter = 1;

    // Adiciona contador se o arquivo já existir
    while (
      await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false)
    ) {
      newFileName = `${nameWithoutExt}-${counter}${ext}`;
      filePath = path.join(
        "./src/images/docs",
        req.body.idcandidato,
        newFileName
      );
      counter++;
    }

    console.log("Nome final do arquivo:", newFileName); // Depuração
    cb(null, newFileName);
  },
});

const uploadDocumento = multer({
  storage: storageDocumento,
  // Verifique se o campo no frontend é 'logo'
  fileFilter: (req, file, cb) => {
    console.log("no uploadDocumento 115 ", file);
    if (file.fieldname === "documento") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});

const apagaDocumentoStorage = async (caminho: string, nome: string) => {
  const dir = `./src/images/docs/${caminho}`;
  const filePath = path.join(dir, nome);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`Arquivo ${filePath} deletado com sucesso.`);
    return { message: `Arquivo ${filePath} deletado com sucesso.` };
  } catch (error) {
    console.error(`Erro ao deletar arquivo ${filePath}:`, error);
    return { error: `Erro ao deletar arquivo ${filePath}: ${error}` };
  }
};
/*#############################  FIMMM UPLOAD DO ARMAZENAMENTO DO DOCUMENTO #################################*/

//*********************** INICIO CADASTRO LOGIN ***********************************/

// async function hashPassword(password:any) {
//   const saltRounds = 12; // Define o custo do processamento
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   return hashedPassword;
// }

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
  //tokenGeral = await generateToken({ email, senha }); //jwt.sign({ email, senha }, SECRET);   // gerar o token jwt sem usar o service.ts
  console.log("valor", valor);
  login.postCadastraLogin([valor]).then((result: any) => {
    res.send(result);
  });
});

//**********************************************************************************/

//************************LOGIN USUARIO ***************************************/

app.post("/login", async (req: Request, res: Response) => {
  console.log("login", req.body);
  if (req.body.senha || req.body.cpf) {
    const cpf = req.body.cpf.replace(/[^0-9]/g, "");
    if (cpf.length == 11) {
      let retorno, situacao;
      console.log("login", req.body);
      try {
        await login.postLogin([cpf]).then(async (result: any) => {
          retorno = result[0][0].SENHA;
          situacao = result[0][0].SITUACAO;

          if (situacao == "B") {
            res
              .status(600)
              .send({ mensagem: "Excesso de tentativas, tente mais tarde." });
            console.log("situacao", situacao);
            return;
          }

          const senha = await verifyPassword(req.body.senha, retorno);
          console.log("senha", req.body.senha);

          if (result.status === "1") {
            res.status(401).send({ mensagem: "Usuário ou senha inválida." });
            return;
          }

          if (senha) {
            const token = await generateToken({ cpf, senha }); //gero o token
            res.send({ token: token });
          } else {
            res.status(401).send({ mensagem: "Usuário ou senha inválida." });
            return;
          }
        });
      } catch (error) {
        res.send({ mensagem: "Serviço indisponível, tente mais tarde." });
        return;
      }
    } else {
      //caso o cpf for menor de 11
      res.status(400).send({ mensagem: "CPF inválido." });
      return;
    }
  } else {
    res.status(400).send({ mensagem: "Dados inválidos." });
    return;
  }
});

//***********************  INICIO CURRICULO                   *************************/

app.get("/curriculo/", verifyToken, async (req: Request, res: Response) => {
  let cpfFormatado: string = (req.query.cpf as string).replace(/[^0-9]/g, "");
  let tamanhoCpf: number;
  tamanhoCpf = cpfFormatado.length as number;
  if (tamanhoCpf != 11) {
    res.status(400).send({ mensagem: "CPF inválido." });
    return;
  }
  //const curriculo = new Curriculo(cpfFormatado);
  curriculo.getCurriculo(cpfFormatado).then((result: any) => {
    res.send(result);
  });
});

const validaIdade = (dataNascimento: any) => {
  const hoje = new Date();
  const dataNasc = new Date(dataNascimento);
  const idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    return idade - 1;
  }
  return idade;
};
app.post("/curriculo", verifyToken, async (req: Request, res: Response) => {
  try {
    // console.log("post curriculo antes linha 164", (req.body));
    var numFilhos = "0";
    var cpf = req.body.cpf;
    console.log("cpf ", cpf);
    var turno = "";
    if (req.body.filhos === "S") {
      numFilhos = req.body.numFilhos;
    }
    if (req.body.estudaAtualmente === "S") {
      turno = req.body.turno;
    }

    const dados = [
      req.body.idcandidato,
      cpf,
      req.body.nome,
      req.body.dataNascimento,
      req.body.sexo,
      req.body.email,
      req.body.rg,
      req.body.orgaoEmissor,
      req.body.estadoEmissor,
      req.body.dataEmissao,
      req.body.nomePai,
      req.body.nomeMae,
      req.body.grauInstrucao,
      req.body.pcd,
      req.body.deficiencia,
      req.body.estudaAtualmente,
      turno,
      req.body.filhos,
      numFilhos,
      req.body.telefone,
      req.body.estadoCivil,
    ];

    if (validaIdade(req.body.dataNascimento) < 14) {
      res.status(400).send({ error: "Voce precisa ser maior de 14 anos." });
    } else if (req.body.dataEmissao < req.body.dataNascimento) {
      res.status(419).send({ error: "Data de emissão do RG inválida." });
    } else {
      curriculo.postcurriculo(dados).then((result: any) => {
        //   console.log("result no post curriculo", result);
        res.send(result);
      });
    }
  } catch (error) {
    console.log("Erro no post curriculo", error);
    res.status(500).send({ error: "Erro ao cadastrar o currículo." });
  }
});
/**********************FIM CURRICULO ******************************/

//*********************PAINEL VAGA**********************************/

app.get("/painelvaga", async (req: Request, res: Response) => {
  painelvaga.getPainelVaga().then((result: any) => {
    res.send(result);
  });
});


//*********************FIM PAINEL VAGA***************************** */


//*************************INICIO VAGAS ***********************/
app.get("/vaga/", async (req: Request, res: Response) => {
  vaga.getVaga().then((result: any) => {
    res.send(result);
  });

});

app.post("/vaga", async (req: Request, res: Response) => {
 
  const valores = [req.body];
  vaga.postVaga(valores).then((result: any) => { 
   res.send(result);
  });
});

app.delete("/vaga/:id",  async (req: Request, res: Response) => {
  console.log("delete vaga ", req.params.id);
  const id = req.params.id;
  vaga.deleteVaga(id).then((result: any) => {
    res.send(result);
  });
});

app.get("/vaga/:id",async (req:Request, res:Response)=>{
  console.log("get vaga ", req.params.id);
  const id = req.params.id;
  vaga.getVagaId(id).then((result: any) => {
    res.send(result);
  });
})
//************************ FIM VAGAS  *************************/

//********************* INICIO EMPRESA *************************/

app.get("/empresa/",  async (req: Request, res: Response) => {
  const result = await empresa.getEmpresa();
  //console.log("get empresa 327", result);
  res.send(result);

  // console.log("get empresa 101", res);
});

app.post("/empresa",  async (req: Request, res: Response) => {
 
  const valores = [{
   idempresa: req.body.idempresa,
   descempresa: req.body.descempresa,
   desccidade: req.body.desccidade,
   maps: req.body.maps,
   logo: req.body.logo,
}];
  console.log("post empresa no app ", valores[0].logo);

  empresa.postEmpresa(valores).then((result: any) => {
    res.send(result);
  });
 
});
app.delete("/empresa/:id", verifyToken, async (req: Request, res: Response) => {
  console.log("delete empresa ", req.params.id);
  const id = req.params.id;
  empresa.delEmpresa(id).then((result: any) => {
    res.send(result);
  });
});

//************************** FIM EMPRESA *************************/

//*************************INICIO CEP  *************************/
app.get("/cep", verifyToken, async (req: Request, res: Response) => {
  let cepFormatado: string = (req.query.cep as string).replace(/[^0-9]/g, "");
  let tamanhoCep: number;
  tamanhoCep = cepFormatado.length as number;
  if (tamanhoCep === 8) {
    cep.getCep(cepFormatado).then((result: any) => {
      console.log("result cep", result);
      res.send(result);
    });
  } else {
    res.send({ error: "Formato inválido" });
  }
});
//************************** FIM CEP **************************/
//**************************INICIA RESIDENCIA*********************/

app.post(
  "/retornaresidencia/",
  verifyToken,
  async (req: Request, res: Response) => {
    const valores = req.body;
    console.log("get residencia app ", valores);
    const result = await residencia.getResidencia(valores);
    res.send(result);
  }
);

app.post("/residencia", verifyToken, async (req: Request, res: Response) => {
  const valores = [
    req.body.idcandidato,
    req.body.cpf,
    req.body.cep,
    req.body.estado,
    req.body.cidade,
    req.body.endereco,
    req.body.bairro,
    req.body.numero,
  ];
  console.log("valores req 298", cep);

  residencia.postResidencia(valores).then((result: any) => {
    res.send(result);
  });
  console.log("post residencia 304");
});

//**************************FIM RESIDENCIA*************************/

/********************** INICIO LOGO ************************/
app.post(
  "/uploadlogo",
  uploadLogo.single("logo"),
  
  async (req: any, res: any) => {
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

app.get(
  "/documento/",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    console.log(
      "get documento 101",
      req.query.idcandidato,
      " - ",
      req.query.cpf
    );
    if (!req.query.idcandidato || !req.query.cpf) {
      res.status(400).send({ error: "ID Candidato e CPF são obrigatórios." });
      return;
    }
    const result = await documento.getDocumento(
      req.query.idcandidato,
      req.query.cpf
    );
    res.send(result);
  }
);

app.post(
  "/uploaddocumento",
  uploadDocumento.single("documento"),
  verifyToken,
  async (req: any, res: any) => {
    console.log("no uploadDocumento 418 ", uploadDocumento.single("documento"));
    if (!req.file) {
      console.log("req file no ! ", req.file);
      return res.status(400).send({ error: "Nenhum arquivo enviado" });
    } else {
      let nomeArquivo = Buffer.from(req.file.originalname, "binary").toString(
        "utf-8"
      );
      console.log("nome do arquivo  424", nomeArquivo);
      res.send(req.file);
      const valores = {
        idcandidato: req.body.idcandidato,
        cpf: req.body.cpf,
        documento: nomeArquivo,
      };
      documento.postDocumento(valores).then((result: any) => {
        res.send(result);
      });
      return;
    }
  }
);

app.delete(
  "/documento/:idcandidato/:cpf/:nome",
  verifyToken,
  async (req: Request, res: Response) => {
    const { idcandidato, cpf, nome } = req.params;
    console.log("delete documento ", idcandidato, cpf, nome);
    const result = await documento.deleteDocumento(
      Number(idcandidato),
      Number(cpf),
      nome
    );

    const val = await apagaDocumentoStorage(idcandidato, nome);
    if (val.error) {
      console.error("Erro ao deletar arquivo:", val.error);
      res.status(500).send({ error: "Erro ao deletar arquivo." });
    } else {
      console.log("Arquivo deletado com sucesso:", val.message);
      res.send(result);
    }
  }
);

app.use("/documento", express.static(path.join(__dirname, "/images/docs")));
//*********************************** FIM DOCUMENTOS *****/

/********************** INICIO EXPERIECIA *************************/
app.get("/experiencia", verifyToken, async (req: Request, res: Response) => {
  console.log("get experiencia 101", req.query.idcandidato);
  const valores = { idcandidato: req.query.idcandidato, cpf: req.query.cpf };
  const result = await experiencia.getExperiencia(valores);
  res.send(result);
});

app.post("/experiencia", verifyToken, async (req: Request, res: Response) => {
  const valores = req.body; //[req.body.idcandidato,req.body.cpf,req.body.primeiroEmprego, req.body.empresa, req.body.cidade, req.body.cargo];
  console.log("post experiencia ", valores);
  experiencia.postExperiencia(valores).then((result: any) => {
    res.send(result);
  });
});
//************************FIM EXPERIENCIA***************************/

//*************************INICIO EMAIL / ALTERA SENHA ****************************/
app.post("/recuperar-senha", async (req: Request, res: Response) => {
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
              if (envio.error) {
                console.error("Erro ao enviar e-mail 523:", envio.error);
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
     console.log("valores da senha NO APP", valores.novaSenha, novaSenhaHash);
     valores = [valores.codcli, valores.cpf.replace(/[^0-9]/g, ""),novaSenhaHash];
     const result = await alteraSenha.putAlteraSenha(valores);
     res.send(result);
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).send({ error: "Erro ao alterar senha." });
  }
 });

/**/

//************************FIM  EMAIL / ALTERA SENHA **************************** */

export default app;
