require("dotenv").config();
import express from "express";
import { Request, Response } from "express";

const bodyParser = require("body-parser");
import multer from "multer";
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
/************************* UPLOAD DO ARMAZENAMENTO DO LOGO ****************************************/

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
  const cpf = req.body.cpf.replace(/[^0-9]/g, "");
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
      console.log("senha", senha);
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
    
    console.log("post curriculo antes linha 164", (req.body));
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
      res.send({ error: "Voce precisa ser maior de 14 anos." });
    } else {
      curriculo.postcurriculo(dados).then((result: any) => {
        console.log("result no post curriculo", result);
        res.send(result);
      });
    }
  } catch (error) {
    console.log("Erro no post curriculo", error);
    res.status(500).send({ error: "Erro ao cadastrar o currículo." });
  }
});
/**********************FIM CURRICULO ******************************/

//*************************INICIO VAGAS ***********************/
app.get("/vaga/", async (req: Request, res: Response) => {
  vaga.getVaga().then((result: any) => {
    res.send(result);
  });
  console.log("get vaga 101", res);
});

app.post("/vaga", async (req: Request, res: Response) => {
  console.log("post vaga ", req.body);
  const valores = [req.body];
  vaga.postVaga(valores).then((result: any) => {
    const dados = [req.body];
    res.send(result);
  });
});
//************************ FIM VAGAS  *************************/

//********************* INICIO EMPRESA *************************/

app.get("/empresa/", verifyToken, async (req: Request, res: Response) => {
  const result = await empresa.getEmpresa();
  res.send(result);

  // console.log("get empresa 101", res);
});

app.post("/empresa", verifyToken, async (req: Request, res: Response) => {
  console.log("post empresa ", req.body);
  const valores = [
    req.body.idempresa,
    req.body.descempresa,
    req.body.desccidade,
    req.body.maps,
    req.body.logo,
  ];

  empresa.postEmpresa(valores).then((result: any) => {
    res.send(result);
  });
  console.log("post empresa ", valores);
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

app.post("/retornaresidencia/", verifyToken, async (req: Request, res: Response) => {
  const valores = req.body;
  console.log("get residencia app ", valores);
  const result = await residencia.getResidencia(valores);
  res.send(result);
});

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
  verifyToken,
  async (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).send({ error: "Nenhum arquivo enviado" });
    } else {
      console.log("req file ", req.file);
      res.send(req.file);
      return;
    }
  }
);
app.use("/logo", express.static(path.join(__dirname, "/images/logo")));
/**********************************************


/********************** INICIO EXPERIECIA *************************/
app.get("/experiencia", verifyToken, async (req: Request, res: Response) => {
  console.log("get experiencia 101",req.query.idcandidato);
  const valores = {"idcandidato" :req.query.idcandidato,"cpf": req.query.cpf};
  const result = await experiencia.getExperiencia(valores);
  res.send(result);
});

app.post("/experiencia", verifyToken, async (req: Request, res: Response) => {
  const valores = req.body;//[req.body.idcandidato,req.body.cpf,req.body.primeiroEmprego, req.body.empresa, req.body.cidade, req.body.cargo];
  console.log("post experiencia ", valores);
 experiencia.postExperiencia(valores).then((result: any) => {
    res.send(result);
  });
});
//************************FIM EXPERIENCIA***************************/


export default app;
