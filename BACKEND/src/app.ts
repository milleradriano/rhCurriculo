require("dotenv").config();
import express from "express";

const bodyParser = require("body-parser");
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
import { Request, Response } from "express";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
//***********************  INICIO CURRICULO                   *************************/

app.get("/curriculo", async (req: Request, res: Response) => {
  curriculo.getCurriculo().then((result: any) => {
    console.log(result);
    res.send(result);
  });
});

app.post("/curriculo", async (req: Request, res: Response) => {
  console.log(req.body);
  const dados = [
    req.body.cpf,
    req.body.nome,
    req.body.datanascimento,
    req.body.email,
    req.body.rg,
    req.body.orgaoemissorrg,
    req.body.estadorg,
    req.body.dataexpedicaorg,
    req.body.nomepai,
    req.body.nomemae,
    req.body.grauinstrucao,
    req.body.pcd,
    req.body.pcddeficiencia,
    req.body.esttudaatualmente,
    req.body.possuifilho,
    req.body.telefone,
    req.body.estadocivil,
  ];
  curriculo.postcurriculo(dados).then((result: any) => {
    console.log(result);
    res.send(result);
  });
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
  })
});
//************************ FIM VAGAS  *************************/

//********************* INICIO EMPRESA *************************/

app.get("/empresa/", async (req: Request, res: Response) => {
  const result = await empresa.getEmpresa()
    res.send(result);
  
  // console.log("get empresa 101", res);
});

/*************  ✨ Codeium Command 🌟  *************/
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
  })
   console.log("post empresa ", valores);
});
app.delete("/empresa/:id", async (req: Request, res: Response) => {
  console.log("delete empresa ", req.params.id);
  const id = req.params.id;
  empresa.delEmpresa(id).then((result: any) => {
    res.send(result);
  })

})
//************************** FIM EMPRESA ************************ */

export default app;
