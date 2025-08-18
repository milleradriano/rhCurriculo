import 'dotenv/config';
const URL_CEP = process.env.URL_CEP;
import axios from 'axios';
import { Router,Request, Response  } from "express";
import Joi from 'joi';


const router = Router();

const cepSchema = Joi.object({

    cep: Joi.string().length(8).required().pattern(/^\d+$/).replace(/-/g, '')
  

})

router.get("/:cep", async (req: Request, res: Response) => {
    const { error } = cepSchema.validate(req.params);
    console.log("params", req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { cep } = req.params;
    console.log("params", `${cep}`);
    try {
      const response = await axios.get(`${URL_CEP}/${cep}/json/`);
        const result = response.data;
        res.json(result);
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

export default router;

