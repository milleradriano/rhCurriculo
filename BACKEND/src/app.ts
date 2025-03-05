require("dotenv").config();
import express from "express";

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
import { Request, Response } from "express";
import { toFormData } from "axios";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (request: any, response: any) => {
//   return response.send("Hello!");
// });

let tokenGeral: any = "";
const blackList: any[] = [];
function verifyJwt(
  req: { headers: { [x: string]: any } },
  res: { sendStatus: (arg0: number) => void; sendDesc: (arg1: string) => void },
  next: () => void
) {
  const token = req.headers["x-access-token"];
  tokenGeral = token;
  const index = blackList.findIndex((element) => element === token);
  if (index > -1) {
    // console.log("token invalido");
    console.log(res);
    res.sendStatus(403);
  } else {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        res.sendStatus(403);
      } else {
        tokenGeral = token;
        next();
      }
    });
  }
}

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

//***********************  INICIO CURRICULO                   *************************/

app.get("/curriculo", async (req: Request, res: Response) => {
  curriculo.getCurriculo().then((result: any) => {
    console.log(result);
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
app.post("/curriculo", async (req: Request, res: Response) => {
  const dados = [
    req.body.cpf,
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
    req.body.turno,
    req.body.filhos,
    req.body.numFilhos,
    req.body.telefone,
    req.body.estadoCivil,
  ];

  if (validaIdade(req.body.dataNascimento) < 14) {
    res.send({ error: "Voce precisa ser maior de 14 anos." });
  } else {
    curriculo.postcurriculo(dados).then((result: any) => {
      res.send(result);
    });
  }
});

/**********************FIM CURRICULO ******************************/

//*************************INICIO CEP  *************************/

app.get("/cep", async (req: Request, res: Response) => {
  let cepFormatado: string = (req.query.cep as string).replace(/[^0-9]/g, "");
  let tamanhoCep: number;
  tamanhoCep = cepFormatado.length as number;
  if (tamanhoCep === 8) {
    cep.getCep(cepFormatado).then((result: any) => {
      res.send(result);
    });
  } else {
    res.send({ error: "Formato inválido" });
  }
});
//************************** FIM CEP **************************/

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

app.get("/empresa/", async (req: Request, res: Response) => {
  const result = await empresa.getEmpresa();
  res.send(result);

  // console.log("get empresa 101", res);
});

app.post("/empresa", async (req: Request, res: Response) => {
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
app.delete("/empresa/:id", async (req: Request, res: Response) => {
  console.log("delete empresa ", req.params.id);
  const id = req.params.id;
  empresa.delEmpresa(id).then((result: any) => {
    res.send(result);
  });
});

//************************** FIM EMPRESA *************************/

//**************************INICIA RESIDENCIA*********************/

app.get("/residencia/", async (req: Request, res: Response) => {
  const result = await residencia.getResidencia();
  res.send(result);
});

app.post("/residencia", async (req: Request, res: Response) => { 
  console.log("post residencia ", req.body);
  const valores = [
    req.body.cpf,
    req.body.primeiroemprego,
    req.body.ultimoempregoempresa,
    req.body.ultimoempregocidade,
    req.body.ultimoempregocargo,
    req.body.ultimoempregoinicio,
    req.body.ultimoempregoatribuicao,
    req.body.penultimoempregoempresa,
    req.body.penultimoempregocidade,
    req.body.penultimoempregocargo,
    req.body.penultimoempregoinicio,
    req.body.penultimoempregoatribuicao,
  ];
  residencia.postResidencia(valores).then((result: any) => {
    res.send(result);
  });
  console.log("post residencia ", valores);
});

//**************************FIM RESIDENCIA*************************/


/********************** INICIO LOGO ************************/
app.post(
  "/uploadlogo",
  uploadLogo.single("logo"),
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
/**************************************************************/


app.use("/logo", express.static(path.join(__dirname, "/images/logo")));

export default app;
