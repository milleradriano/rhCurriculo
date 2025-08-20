// app.get("/painelvaga", async (req: Request, res: Response) => {
//   painelvaga.getPainelVaga().then((result: any) => {
//     res.send(result);
//   });
// });
import { Router, Request, Response } from "express";
import { getPainelVaga } from "../services/painelVaga.js";

const router = Router();

// GET /painelvaga - Listar vagas do painel
router.get("/", async (req: Request, res: Response) => {
  
  try {
    const vagas = await getPainelVaga();   
    res.json( vagas );
  } catch (error: any) {
    res.status(503).json({ mensagem: "Erro ao buscar vagas: " + error.message });
  }
});

export default router;